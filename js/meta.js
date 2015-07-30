!function(){
  var meta = new Keen({
    projectId: "5579d31ac2266c48ad2b17a6",
    writeKey: "81afb1829add42142453e0fef36073b7b9c63bfb56f0b57c2eadcbe2a1becd49d354324b6730c9b43c5bd14be6abad2a29553589a35d5537a7d9899b48af45a70ba9ba46c77c5824334710156048e28e885a559c15cc896ff715af7ebb407db64ceaa54f5f617b1a0f2bb461c295c1f3"
  });
  meta.addEvent("visits", {
    page: {
      title: document.title,
      host: document.location.host,
      href: document.location.href,
      path: document.location.pathname,
      protocol: document.location.protocol.replace(/:/g, ""),
      query: document.location.search
    },
    visitor: {
      referrer: document.referrer,
      ip_address: "${keen.ip}",
      // tech: {} //^ created by ip_to_geo add-on
      user_agent: "${keen.user_agent}"
      // visitor: {} //^ created by ua_parser add-on
    },
    keen: {
      timestamp: new Date().toISOString(),
      addons: [
        { name:"keen:ip_to_geo", input: { ip:"visitor.ip_address" }, output:"visitor.geo" },
        { name:"keen:ua_parser", input: { ua_string:"visitor.user_agent" }, output:"visitor.tech" }
      ]
    }
  });
  // More data modeling examples here:
  // https://github.com/keenlabs/data-modeling-guide/
}();