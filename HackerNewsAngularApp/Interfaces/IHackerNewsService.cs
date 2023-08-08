namespace HackerNewsAngularApp.Interfaces
{
    public interface IHackerNewsService
    {
        // Retrieves the IDs of new stories from the Hacker News API
        Task<List<int>> GetNewStoriesIds();

        // Retrieves a list of news items based on a list of IDs
        Task<List<INewsItem>> GetItems(List<int> itemIds);

        // Retrieves a filtered list of news items based on a search query, the range of documents to return
        // to the user and an optional startId based off the last story loaded
        Task<List<INewsItem>> GetItemsByFilter(List<int> ids, int range, string query, int startId);
    }
}
