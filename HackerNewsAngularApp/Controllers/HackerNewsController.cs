using Microsoft.AspNetCore.Mvc;
using HackerNewsAngularApp.Interfaces;

namespace HackerNewsAngularApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HackerNewsController : ControllerBase
    {
        private readonly IHackerNewsService _hackerNewsService;

        public HackerNewsController(IHackerNewsService hackerNewsService)
        {
            _hackerNewsService = hackerNewsService;
        }

        [HttpGet("ids")]
        public async Task<ActionResult<List<int>>> GetIds()
        {
            // Retrieve and return new story IDs from the service
            var ids = await _hackerNewsService.GetNewStoriesIds();
            return Ok(ids);
        }

        [HttpGet]
        [Route("newResults")]
        public async Task<ActionResult<List<INewsItem>>> GetNewResults()
        {
            try
            {
                // Retrieve new story IDs
                var newStoriesIds = await _hackerNewsService.GetNewStoriesIds();

                if (newStoriesIds == null || newStoriesIds.Count == 0)
                {
                    return NotFound();
                }

                // Get the first 10 items based on new story IDs
                var items = await _hackerNewsService.GetItems(newStoriesIds.GetRange(0, Math.Min(10, newStoriesIds.Count)));

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("newresultsbypage/{pageNumber}")]
        public async Task<ActionResult<List<INewsItem>>> GetNewResultsByPage(int pageNumber)
        {
            try
            {
                if (pageNumber <= 0)
                {
                    return BadRequest("Page number must be greater than 0.");
                }

                // Retrieve new story IDs
                var newStoriesIds = await _hackerNewsService.GetNewStoriesIds();

                if (newStoriesIds == null || newStoriesIds.Count == 0)
                {
                    return NotFound();
                }

                int itemsPerPage = 10;
                int startIndex = (pageNumber - 1) * itemsPerPage;
                int endIndex = Math.Min(startIndex + itemsPerPage, newStoriesIds.Count);

                // Get items for the requested page
                var pageItemIds = newStoriesIds.GetRange(startIndex, endIndex - startIndex);
                var items = await _hackerNewsService.GetItems(pageItemIds);

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<INewsItem>>> SearchItems([FromQuery] string query, [FromQuery] int startId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest("Search query cannot be empty.");
                }

                // Retrieve new story IDs
                var newStoriesIds = await _hackerNewsService.GetNewStoriesIds();

                if (newStoriesIds == null || newStoriesIds.Count == 0)
                {
                    return NotFound();
                }

                // Get matching items based on the search query and start ID
                var matchingItems = await _hackerNewsService.GetItemsByFilter(newStoriesIds, 10, query, startId);

                return Ok(matchingItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}




