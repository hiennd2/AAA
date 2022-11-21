const { SparqlEndpointFetcher } = require('fetch-sparql-endpoint')
const fetcher = new SparqlEndpointFetcher();


exports.queryDbpedia = async (query, res) => {
    try {
        const bindingsStream =
            await fetcher.fetchBindings('https://dbpedia.org/sparql', query);
        bindingsStream.on('data', binding => {

            handleResultQuery(binding)

            res.json(binding)
            // console.log(binding)
        });
    } catch (error) {
        console.log("Error bindingsStream: ", error);
    }
}


exports.handleResultQuery = (resultSet) => {
    console.log(resultSet)
    const infoAuth = []
    for (const result in resultSet) {
        console.log(result)
        // const authorAll = {}
        // authorAll.bookLink = result["s"] || ''
        // authorAll.name = result.bookName || ''
        // authorAll.authorLink = result.authorLink || ''
        // authorAll.author = result.author || ''

        // console.log(authorAll);
        // infoAuth.push(authorAll)
    }

    // console.log("infoAuth: ", infoAuth);
}


exports.queryUserSearchBookName = (userSearch) => {
    const query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX ontology: <http://dbpedia.org/ontology/> " +
        "SELECT distinct ?s ?bookName ?authorLink ?author  WHERE { " +
        "?s rdf:type ontology:Book; " +
        "rdfs:label ?bookName; " +
        "ontology:author ?authorLink. " +
        "?authorLink rdfs:label ?author " +

        "FILTER ( regex (str(?bookName), '" + userSearch + "', 'i') ). " +
        "FILTER (lang(?author) = 'en') " +
        "FILTER (lang(?bookName) = 'en') " +
        "}";

    return query
}

exports.queryAuthorBook = (authorLink) => {
    const query =
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX ontology: <http://dbpedia.org/ontology/> " +
        "SELECT distinct ?authorLink ?bookLink ?bookName ?bookAbstract (MAX(?numberOfPages) as ?numberOfPages) ?comment WHERE { " +
        "?bookLink rdf:type ontology:Book; " +
        "rdfs:label ?bookName; " +
        "dbo:abstract ?bookAbstract; " +
        "rdfs:comment ?comment; " +
        "ontology:author ?authorLink. " +
        "OPTIONAL {?bookLink dbo:numberOfPages ?numberOfPages.}" +
        "FILTER(regex (str(?authorLink), '" + authorLink + "' , 'i') ). " +
        "FILTER(lang(?bookName) = 'en') " +
        "FILTER(lang(?bookAbstract) = 'en') " +
        "FILTER(lang(?comment) = 'en') " +
        "}";
    return query;
}

exports.queryAuthorDetail = (authorLink) => {
    // const query =
    //     "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
    //     "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    //     "PREFIX ontology: <http://dbpedia.org/ontology/> " +
    //     "SELECT distinct ?authorLink ?authorName ?placeOfBirthLink ?PlaceOfBirth ?latitude ?longitude WHERE { " +
    //     "?authorLink a dbo:Person; " +
    //     "rdfs:label ?authorName; " +
    //     "dbo:birthPlace ?placeOfBirthLink. " +
    //     "?placeOfBirthLink rdfs:label ?PlaceOfBirth; " +
    //     "geo:lat ?latitude; " +
    //     "geo:long ?longitude. " +

    //     "FILTER(regex (str(?authorLink), '" + authorLink + "', 'i') ). " +
    //     "FILTER(lang(?authorName) = 'en') " +
    //     "FILTER(lang(?PlaceOfBirth) = 'en') " +
    //     "}";

    const query = 
    `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX ontology: <http://dbpedia.org/ontology/> 
    SELECT distinct ?authorLink ?bookLink ?bookName ?bookAbstract (MAX(?numberOfPages) as ?numberOfPages) ?comment WHERE { 
        ?bookLink rdf:type ontology:Book; 
        rdfs:label ?bookName; 
        dbo:abstract ?bookAbstract; 
        rdfs:comment ?comment; 
        ontology:author ?authorLink. 
        OPTIONAL {?bookLink dbo:numberOfPages ?numberOfPages.}
        FILTER(regex (str(?authorLink), '${authorLink}', 'i') ). 
        FILTER(lang(?bookName) = 'en') 
        FILTER(lang(?bookAbstract) = 'en') 
        FILTER(lang(?comment) = 'en') 
    }`
    return query;
}

