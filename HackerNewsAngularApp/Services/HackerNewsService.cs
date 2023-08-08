using HackerNewsAngularApp.Interfaces;
using HackerNewsAngularApp.Implementations;
using Microsoft.Extensions.Caching.Memory;

namespace HackerNewsAngularApp.Services
{
    public class HackerNewsService : IHackerNewsService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IMemoryCache _memoryCache;

        public HackerNewsService(IHttpClientFactory httpClientFactory, IMemoryCache memoryCache)
        {
            _httpClientFactory = httpClientFactory;
            _memoryCache = memoryCache;
        }

        // Retrieves the IDs of new stories from the Hacker News API
        public async Task<List<int>> GetNewStoriesIds()
        {
            using var httpClient = _httpClientFactory.CreateClient();
            // Hit hackernews API for 500 new stories ids
            var response = await httpClient.GetAsync("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty");
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            return Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(content);
        }

        // Retrieves a list of news items based on a list of IDs
        public async Task<List<INewsItem>> GetItems(List<int> ids)
        {
            var items = new List<INewsItem>();

            foreach (var id in ids)
            {
                // If not in cache, make call to hackernews api
                if (!_memoryCache.TryGetValue<INewsItem>(id.ToString(), out var newcachedItem))
                {
                    using var httpClient = _httpClientFactory.CreateClient();
                    var response = await httpClient.GetAsync($"https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty");
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        var item = Newtonsoft.Json.JsonConvert.DeserializeObject<NewsItem>(content);
                        if (item != null)
                        {
                            items.Add(item);
                            // Add to cache
                            _memoryCache.Set(id.ToString(), item, TimeSpan.FromMinutes(10));
                        }    
                    }
                }

                // Else get from cache
                else
                {
                    items.Add(_memoryCache.Get<INewsItem>(id.ToString()));
                }
            }

            return items;
        }

        // Retrieves a filtered list of news items based on a search query, the range of documents to return
        // to the user and an optional startId based off the last story loaded
        public async Task<List<INewsItem>> GetItemsByFilter(List<int> ids, int range, string query, int startId)
        {
            // Counter for amount to return 
            int counter = 0;
            var items = new List<INewsItem>();
            // Start Index for where in the list of new stories did the user leave off
            var startIndex = 0;

            // If startId exists find index, otherwise start at first story
            if (startId > 0)
            {
                startIndex = ids.IndexOf(startId) + 1;
            }

            for (int i = startIndex; i < ids.Count; i++)
            {
                var id = ids[i];

                // If not in cache, make call to hackernews api
                if (!_memoryCache.TryGetValue<INewsItem>(id.ToString(), out var newcachedItem))
                {
                    using var httpClient = _httpClientFactory.CreateClient();
                    var response = await httpClient.GetAsync($"https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty");
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        var item = Newtonsoft.Json.JsonConvert.DeserializeObject<NewsItem>(content);
                        if (item != null && item.Title != null)
                        {
                            // Check to see if matches search query
                            if (item.Title.Contains(query, StringComparison.OrdinalIgnoreCase))
                            {
                                items.Add(item);

                                // Add 1 to amount to return
                                counter++;
                            }

                            // Add to cache
                            _memoryCache.Set(id.ToString(), item, TimeSpan.FromMinutes(10));
                        }
                    }
                }

                // Else get from cache
                else
                {
                    // Check to see if matches search query
                    if (_memoryCache.Get<INewsItem>(id.ToString()).Title.Contains(query, StringComparison.OrdinalIgnoreCase))
                    {
                        items.Add(_memoryCache.Get<INewsItem>(id.ToString()));

                        // Add 1 to amount to return
                        counter++;
                    }
                }

                // Return if we hit max range: IE 10
                if (counter == range - 1)
                {
                    return items;
                }
            }

            return items;
        }
    }
}