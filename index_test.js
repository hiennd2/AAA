const SparqlClient = require('sparql-http-client')

const endpointUrl = 'https://dbpedia.org/sparql'
const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX ontology: <http://dbpedia.org/ontology/>
      SELECT distinct ?s ?bookName ?authorLink ?author  WHERE { 
          ?s rdf:type ontology:Book; 
             rdfs:label ?bookName; 
             ontology:author ?authorLink. 
          ?authorLink rdfs:label ?author 

          FILTER ( regex (str(?bookName), 'red', 'i') ).
          FILTER (lang(?author) = 'en')
          FILTER (lang(?bookName) = 'en')
      } `

const client = new SparqlClient({ endpointUrl })

const run = async () => {

    const stream = await client.query.select(query)
    stream.on('data', row => {
        // Object.entries(row).forEach(([key, value]) => {
        //     console.log(`${key}: ${value.value} (${value.termType})`)
        // })

        console.log(row)
    })

    stream.on('error', err => {
        console.error(err)
    })
}

try {
    run()
} catch (error) {
    console.log(error)
}