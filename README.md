# TeamsBotSN
A Microsoft Teams bot to connect with ServiceNow.

#Setting up
- Create a Bot in Azure. Follow this process [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-authentication?view=azure-bot-service-4.0&tabs=aadv1%2Cjavascript#create-the-azure-bot-application).
- Create an Application Registry in ServiceNow. Follow this process [here](https://docs.servicenow.com/bundle/orlando-platform-administration/page/administer/security/task/t_CreateEndpointforExternalClients.html).
- In the Application Registry in ServiceNow, set the Redirect URL to https://token.botframework.com/.auth/web/redirect
- In Azure, go to the Bot settings, and add a new Connection Setting.
  - Give it a Name.
  - Select Generic OAuth 2 provider.
  - Use the Client ID created by ServiceNow in step 2.
  - Use the Client Secret created by ServiceNow in step 2.
  - Authorization URL is https://`<ServiceNowInstance>`/oauth_auth.do
  - Token URL is https://`<ServiceNowInstance>`/oauth_token.do
  - Refresh URL is the same as Token URL
- Rename the .env-example file to .env
- Update the .env file
  - BotID is the ID of the Bot in Azure.
  - BotPassword is the password of the Bot.
  - ConnectionName is the exactly same name of the Connection Setting created in step 4.
  - ServiceNowInstance is the URL of the SN instance.
