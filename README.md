# HackerNewsAngularAppAndCSharp

Node Version: 16.14.2
Angular Version: 15.2.6
.Net Version: 6.0
Typescript: 4.9.5

Install these nuget packages if not automatically installed 
![image](https://github.com/josephmspencer00/HackerNewsAngularCSharpApp/assets/141690527/df698e48-76d1-4e30-ae7f-62008cb79a63)

Run 'npm install' in terminal \HackerNewsAngularApp\HackerNewsAngularApp\ClientApp.  Please make sure you have the correct version of node 16.14.2 installed and visual studio is running the correct version

To Run, use visual studio code 2022, and run HackerNewsAngularApp at top with green button. This will launch both the back end and front end code.

Unit and Integration Tests:
C# BackEnd Run 'dotnet test' in terminal \HackerNewsAngularApp
Angular Frontend run 'npm run test' in terminal \HackerNewsAngularApp\HackerNewsAngularApp\ClientApp

NEXT STEPS:

Use IAsyncEnumerable to display the search results as they come back.  The load time for the search call takes a long time because I have to hit the endpoint for every document.
By adding IAsyncEnumerable it will display to the user in a smoother fashion making the experience not as slow.

Use a bot scraper to go to the websites that are returned from the news stories to get logos, pictures, and summaries from the websites.

Leverage UX resources to create a responsive user friendly design that can be accomplished using bootstrap and css

Use SQL to create databases for user to store their favorite stories and view again later on login
