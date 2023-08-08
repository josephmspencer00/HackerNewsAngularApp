using System;
using System.Net;
using HackerNewsAngularApp.Implementations;
using HackerNewsAngularApp.Services;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using Xunit;

namespace HackerNewsAngularApp.BackendTests

{
    public class HackerNewsServiceTests
    {
        [Fact]
        public async Task GetNewStoriesIds_ReturnsListOfIds()
        {
            // Arrange
            var expectedIds = new List<int> { 1, 2, 3 }; // Set up your expected IDs here

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock.Protected()
                       .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                       .ReturnsAsync(new HttpResponseMessage
                       {
                           StatusCode = HttpStatusCode.OK,
                           Content = new StringContent(JsonConvert.SerializeObject(expectedIds))
                       });

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<string>()))
                                 .Returns(httpClient);

            var hackerNewsService = new HackerNewsService(httpClientFactoryMock.Object, new MemoryCache(new MemoryCacheOptions()));

            // Act
            var result = await hackerNewsService.GetNewStoriesIds();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedIds, result);
        }

        [Fact]
        public async Task GetItems_ReturnsListOfItems()
        {
            // Arrange
            var expectedItem = new NewsItem { By = "user", Title = "Test Item" };
            var itemId = 1;
            var itemJson = "{\"by\":\"user\",\"title\":\"Test Item\"}";

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock.Protected()
                       .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                       .ReturnsAsync(new HttpResponseMessage
                       {
                           StatusCode = HttpStatusCode.OK,
                           Content = new StringContent(itemJson)
                       });

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var memoryCacheMock = new Mock<IMemoryCache>();
            var cacheEntryMock = new Mock<ICacheEntry>();

            memoryCacheMock
                .Setup(m => m.CreateEntry(It.IsAny<object>()))
                .Returns(cacheEntryMock.Object);

            var hackerNewsService = new HackerNewsService(httpClientFactoryMock.Object, memoryCacheMock.Object);

            // Act
            var items = await hackerNewsService.GetItems(new List<int> { itemId });

            // Assert
            Assert.Single(items);
            Assert.Equal(expectedItem.By, items[0].By);
            Assert.Equal(expectedItem.Title, items[0].Title);
        }

        [Fact]
        public async Task GetItemsByFilter_ReturnsFilteredItems()
        {
            // Arrange
            var expectedItem = new NewsItem { By = "user", Title = "Test Item" };
            var itemId = 1;
            var itemJson = "{\"by\":\"user\",\"title\":\"Test Item\"}";

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock.Protected()
                       .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                       .ReturnsAsync(new HttpResponseMessage
                       {
                           StatusCode = HttpStatusCode.OK,
                           Content = new StringContent(itemJson)
                       });

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var memoryCacheMock = new Mock<IMemoryCache>();
            var cacheEntryMock = new Mock<ICacheEntry>();

            memoryCacheMock
                .Setup(m => m.CreateEntry(It.IsAny<object>()))
                .Returns(cacheEntryMock.Object);


            var hackerNewsService = new HackerNewsService(httpClientFactoryMock.Object, memoryCacheMock.Object);

            // Act
            var items = await hackerNewsService.GetItemsByFilter(new List<int> { itemId }, 1, "Test", 0);
           

            // Assert
            Assert.Single(items);
            Assert.Equal(expectedItem.By, items[0].By);
            Assert.Equal(expectedItem.Title, items[0].Title);
            
        }

        [Fact]
        public async Task GetItems_ReturnsEmptyListForEmptyIds()
        {
            // Arrange
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            var memoryCacheMock = new Mock<IMemoryCache>();
            var hackerNewsService = new HackerNewsService(httpClientFactoryMock.Object, memoryCacheMock.Object);

            // Act
            var items = await hackerNewsService.GetItems(new List<int>());

            // Assert
            Assert.Empty(items);
        }

        [Fact]
        public async Task GetItemsByFilter_ReturnsEmptyListForNoMatchingItems()
        {
            // Arrange
            var itemJson = "{}";

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock.Protected()
                       .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                       .ReturnsAsync(new HttpResponseMessage
                       {
                           StatusCode = HttpStatusCode.OK,
                           Content = new StringContent(itemJson)
                       });

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var memoryCacheMock = new Mock<IMemoryCache>();
            var hackerNewsService = new HackerNewsService(httpClientFactoryMock.Object, memoryCacheMock.Object);

            var ids = new List<int> { 1 };
            var range = 10;
            var query = "NonExistentQuery";
            var startId = 0;

            // Act
            var items = await hackerNewsService.GetItemsByFilter(ids, range, query, startId);

            // Assert
            Assert.Empty(items);
        }

    }
}
