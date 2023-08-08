namespace HackerNewsAngularApp.Interfaces
{
    public interface INewsItem
    {
        // Define the properties that you want to capture from the response JSON
        public int Id { get; set; }
        public string By { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
    }
}
