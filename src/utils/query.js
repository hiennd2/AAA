const SparqlClient = require('sparql-http-client')

const endpointUrl = 'https://dbpedia.org/sparql'

const client = new SparqlClient({ endpointUrl })

exports.queryDbpedia = async (query, res) => {
    const stream = await client.query.select(query)
    stream.once('data', data => {
        // Object.entries(row).forEach(([key, value]) => {
        //     console.log(`${key}: ${value.value} (${value.termType})`)
        // })
        res.json(data)
        // console.log(row)
    })

    stream.on('error', err => {
        console.error("error stream: ", err)
    })

}


exports.getStream = async (query) => {
    const stream = await client.query.select(query)
    return stream
}


exports.handleResult = (authors) => {
    console.log(authors)

    return
    for (var author in authors) {
        const authorInfo = {
            s: author.s,
            bookName: author.bookName,
            authorLink: author.bookName,
            author: author.author
        }

        console.log("author info: ", authorInfo)
    }
}

exports.queryUserSearchBookName = (userSearch) => {
    const query = 
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
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
        "} LIMIT 5";

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
    const query =
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX ontology: <http://dbpedia.org/ontology/> " +
        "SELECT distinct ?authorLink ?authorName ?placeOfBirthLink ?PlaceOfBirth ?latitude ?longitude WHERE { " +
        "?authorLink a dbo:Person; " +
            "rdfs:label ?authorName; " +
            "dbo:birthPlace ?placeOfBirthLink. " +
        "?placeOfBirthLink rdfs:label ?PlaceOfBirth; " +
            "geo:lat ?latitude; " +
            "geo:long ?longitude. " +

        "FILTER(regex (str(?authorLink), '" + authorLink + "', 'i') ). " +
        "FILTER(lang(?authorName) = 'en') " +
        "FILTER(lang(?PlaceOfBirth) = 'en') " +
    "}";
return query;
}
