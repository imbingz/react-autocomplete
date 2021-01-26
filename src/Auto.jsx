import React, { useState, useEffect, useRef } from 'react';

function Auto() {
  // set initial input search state 
  const [ search, setSearch ] = useState('')
  // set initial option list to an empty array n change it to pokemon data when input field is clicked
  const [ options, setOptions ] = useState([])
  const [ display, setDisplay ] = useState(false)
  //set ref on div wrapper 
  const wrapperRef = useRef();

  // on page load, fetch info 
  useEffect(() => {
    const pokemons = [];
    //setup a promises array of 20 prokenmon fetch 
    const promises = [...Array(20)].map((v, i) => fetch(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`))

    //use Promise.all to wait for all fetches are done and then deconstruct the name n image we need from data 
    Promise.all(promises)
           .then(res => res.map(
           pokemon => pokemon.json()
                             .then( data => {
                              // decontruct name and image 
                               const { name, sprites: {front_default: sprite }} = data
                              //  console.log(name, sprite);
                              pokemons.push({ name, sprite })
                            })
          ));
    setOptions(pokemons)
  }, [])

  //set display to false when area outside of component is clicked 
  useEffect(() => {

    const handleOutsideClick = (e) => {
      if(wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDisplay(false)
      }
    }

    //add event listener to window 
    window.addEventListener('mousedown', handleOutsideClick)

    //unbind event listener 
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  })

  return (
    <div ref={wrapperRef}>
      <label htmlFor="auto"></label> 
      <input type="text"
        id='auto'
        placeholder='Type your search here ...'
        value={ search }
        onClick={ () => setDisplay(!display) }
        onChange= {(e) => setSearch(e.target.value)}
      />
      {/* option list here */}
      {
        display && options
          .filter( poke => poke.name.includes(search))
          .map((option, i) => (
              <div key={i}
              // allow using keyboard to select
              tabIndex='0' 
              onClick={() => {
                setSearch(option.name)
                setDisplay(false)
              }}
              >
                <span>{option.name}</span>
                <img src={option.sprite} alt={option.name}/>
              </div>
          ))
      }
    </div>
  )
}

export default Auto
