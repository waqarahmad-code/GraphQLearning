import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider,useQuery,gql } from '@apollo/client';
import { render } from '@testing-library/react';
import { NetworkStatus } from '@apollo/client';



const client = new ApolloClient({
  uri: "https://71z1g.sse.codesandbox.io/",
  cache: new InMemoryCache()
});



const EXCHANGE_RATES=gql`
query GetExchangeRates{
  rates(currency:"USD"){
    currency
    rate
  }
}
`;


const GET_DOGS=gql`
query GetDogs{
  dogs{
    id
    breed
  }
}
`;




function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  );
}


const GET_DOG_PHOTO = gql`
query Dog($breed:String!){
  dog(breed:$breed){
    id
    displayImage
  }
}
`;




function DogPhoto({ breed }) {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_DOG_PHOTO,
    {
      variables: { breed },
      notifyOnNetworkStatusChange: true
      // pollInterval: 500
    }
  );

  if (networkStatus === 4) return <p>Refetching!</p>;
  if (loading) return null;
  if (error) return `Error!: ${error}`;

  return (
    <div>
      <div>
        <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
      </div>
      <button onClick={() => refetch()}>Refetch!</button>
    </div>
  );
}






function ExchangeRates(){
  const {loading,error,data}=useQuery(EXCHANGE_RATES);
  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error</p>;

  return data.rates.map(({currency,rate})=>(
    <div key={currency}>
      <p>
        {currency}:{rate}
      </p>

    </div>

  ));
}


function App() {
  
  const [selectedDog,setSelectedDog]=useState(null);
  function onDogSelected({target}){
    setSelectedDog(target.value);
  }

  return(

    <ApolloProvider client={client}>
      <div>
        <h2>Building Query components 🚀</h2>
        {selectedDog && <DogPhoto breed={selectedDog} />}
        <Dogs onDogSelected={onDogSelected} />
      </div>
    </ApolloProvider>

  );


}

render(<App />, document.getElementById("root"));


