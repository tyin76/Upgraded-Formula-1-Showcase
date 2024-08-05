import React, { act, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import '../styles/RaceResult.css'


function RaceResult() {
  const { eventID } = useParams();
  const location = useLocation();
  const {endDate, time} = location.state || {} // passed in date and start time

  const [data, setData] = useState(null);
  const [activeNavIndex, setNavIndex] = useState(99);
  const [displayedRaceInfo, setDisplayedRaceInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(true)

  const raceEntries=[];

  
  

  console.log(eventID);

  const url = `https://f1-motorsport-data.p.rapidapi.com/race-report?eventId=${eventID}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'a1ac7dbe9bmsh47512af3179ad70p1f25adjsn0d37243aa5dc',
      'x-rapidapi-host': 'f1-motorsport-data.p.rapidapi.com'
    }
  };

  useEffect(() => {
    const getAPI = async () => 
    {
        try {
            const response =  await fetch(url, options);
            const result =  await response.json();
            setData(result)
        } catch (error) {
            console.error(error);
        }

    }
    getAPI();
}, [])

console.log(data)

    function StyleRaceInfo() {
      if (data) {
        const positions = data.report.positions;

        const navItems = [];

        positions.forEach((entry, index) => {
          navItems.push(entry.titleTab)
          const raceData = {
            raceType: entry.titleTab ?? 'Undefined Race Type', 
            drivers: entry.positions.map(innerEntry => ({
              name: innerEntry.athleteInfo?.displayName ?? 'Unknown name',
              team: innerEntry.athleteInfo?.team ?? 'Unknown team',
              flag: innerEntry.athleteInfo?.flag?.href ?? 'Unknown Flag',
              headshot: innerEntry.athleteInfo?.headshot?.href ?? 'Unknown headshot',
              position: innerEntry.order ?? 'Unknown order',
              totalTime: innerEntry.stateInfo?.totalTime ?? 'Unknown Time',
              pitStops: innerEntry.stateInfo?.pitsTaken ?? 'Unknown Pits Taken',
              lapsCompleted: innerEntry.stateInfo?.lapsCompleted ?? 'Unknown Laps Completed'
            }))
          };
          raceEntries.push(raceData);
        });

        console.log(raceEntries)

        console.log(positions)
    return (
    <>
    <div className='race-result-container'>

    <div className='race-nav'>
            <nav>
              <ul>
              <div className='race-nav-inner'>
              <li key={99}
              className={99 === activeNavIndex ? 'active' : ''}
              onClick={() => handleInfoNavClick('Info', 99)}
              >Info</li>
              {navItems.map((entry, index) => (
                <li key={index} 
                    className={index === activeNavIndex ? 'active' : ''}
                    onClick={() => handleNavChange(entry, index)}>
                    {entry}
                </li>
              ))}
              </div>
              </ul>

            </nav>
          </div>

    
    
      
      {(displayedRaceInfo && !showInfo) && <div className='displayed-race-info'>

        
          <h1>{displayedRaceInfo.raceType}</h1>
          <h1>{displayedRaceInfo.drivers[0].name}</h1>
        



      </div> }


      {showInfo && <div className='location-info'>
        <h3> City: {data.report.eventInfo.venue.address.city}</h3>
        <h3> Country: {data.report.eventInfo.venue.address.country}</h3>
        <h3> {data.report.racestrip.name}</h3>
        <img className='country-flag' src={data.report.eventInfo.venue.countryFlag.href}></img>
        <h3> Race Day: {endDate} </h3>
        <h3> Start Time: {time} UTC</h3>
      </div> }

      {showInfo && <div className='circuit-info'>
          <img src={data.report.eventInfo.venue.circuit.diagrams[2].href} className='circuit-info-img'></img>
          <h3>Direction: {data.report.eventInfo.venue.circuit.direction}</h3>
          <h3>Lap Length: {data.report.eventInfo.venue.circuit.length}</h3>
          <h3># of Turns: {data.report.eventInfo.venue.circuit.turns}</h3>
          <h3>Established: {data.report.eventInfo.venue.circuit.established}</h3>
          <h3>Circuit Name: {data.report.eventInfo.venue.circuit.fullName}</h3>
          <h3># of Laps: {data.report.eventInfo.venue.circuit.laps}</h3>
          <h3>Race Type: {data.report.eventInfo.venue.circuit.type}</h3>

      
      </div> }

      
      {(data.report?.eventInfo?.venue?.circuit?.fastestLapDriver && showInfo) && 
      <div className='fastest-info'>
        <h3>Fastest Lap Time Record: {data.report.eventInfo.venue.circuit.fastestLapDriver.fastestLapTime} &nbsp;
        ({data.report.eventInfo.venue.circuit.fastestLapDriver.fastestLapYear})</h3>

          <div className='record-holder'>
           <h3>Record Holder: {data.report.eventInfo.venue.circuit.fastestLapDriver.fullName}</h3>
           <img src={data.report.eventInfo.venue.circuit.fastestLapDriver.flag.href} className='record-holder-img'></img>
          </div>
        


      </div>}





</div>



    


  </>
  )
    } else {
      return <h1 className='loading-header'>LOADING...</h1>
    }

  }

  function handleNavChange(entry, index) {
      setNavIndex(index);
      setShowInfo(false);
      const foundRaceInfo = raceEntries.find(race => race.raceType === entry)
      setDisplayedRaceInfo(foundRaceInfo || null)
  }

  function handleInfoNavClick(entry, index) {
      setNavIndex(index);
      setShowInfo(true);
  }
  


  return (
   <>
      <StyleRaceInfo />
   </>
  )
}

export default RaceResult