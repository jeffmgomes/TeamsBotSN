const { TeamsActivityHandler, CardFactory } = require('botbuilder');
const { ServiceNow } = require('../servicenow');

class MessagingExtension extends TeamsActivityHandler {
    constructor(userState) {
        super();
        this.userState = userState;
        this.connectionName = process.env.ConnectionName;
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save state changes
        await this.userState.saveChanges(context);
    }

    async handleTeamsMessagingExtensionSubmitAction(context, action) {
        // Because I only have one action all the logic is in here.

        // When the Bot Service Auth flow completes, the action.State will contain a magic code used for verification.
        const magicCode = (action.state && Number.isInteger(Number(action.state))) ? action.state : '';
        // Try get the token 
        const tokenResponse = await context.adapter.getUserToken(context, this.connectionName, magicCode);

        // Check if there is token
        if (!tokenResponse || !tokenResponse.token) {
            // Retrieve the OAuth Sign in Link from the Azure bot configuration.
            // The connectionName must match the name created in Azure.
            const signInLink = await context.adapter.getSignInLink(context, this.connectionName);

            // Return a message with a botton to Sign in with a link created by the Token Bot Framework.
            return {
                composeExtension: {
                    type: 'auth',
                    suggestedActions: {
                        actions: [{
                            type: 'openUrl',
                            value: signInLink,
                            title: 'Bot Service OAuth'
                        }]
                    }
                }
            };


        }

        console.log(`Token: ${tokenResponse.token}`);
        const sn = new ServiceNow(tokenResponse.token);

        console.log(action.data);
        // Data from Teams
        const data = action.data;

        const response = await sn.createTask(data.priority, "My Task");

        var message = "";
        if (response.status == 201) {
            message = `Task ${response.data.result.number} created!`;
        } else {
            message = `Something went wrong: ${response.status} - ${response.data.error.message}, ${response.data.error.detail}`
        }

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [CardFactory.thumbnailCard(message)]
            }
        };
    }


    // Handles all the actions that has no static fields
    async handleTeamsMessagingExtensionFetchTask(context, action) {
        if (action.commandId === 'SignOutCommand') {
            // Get the adapter
            const adapter = context.adapter;
            // Sign out the User
            await adapter.signOutUser(context, this.connectionName);

            // Create a card to display the sign out message
            const card = CardFactory.adaptiveCard({
                version: '1.0.0',
                type: 'AdaptiveCard',
                body: [
                    {
                        type: 'TextBlock',
                        text: `You have been signed out.`
                    }
                ],
                actions: [
                    {
                        type: 'Action.Submit',
                        title: 'Close',
                        data: {
                            key: 'close'
                        }
                    }
                ]
            });

            // Send the card 
            return {
                task: {
                    type: 'continue',
                    value: {
                        card: card,
                        heigth: 200,
                        width: 400,
                        title: 'Adaptive Card: Inputs'
                    }
                }
            };
        }
    }
}

module.exports.MessagingExtension = MessagingExtension;