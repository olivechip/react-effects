import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardPile.css";

const CardPile = () => {
    const [ API_URL, setAPI_URL] = useState("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const [ deckId, setDeckId ] = useState("");
    const [ currentCards, setCurrentCards ] = useState([]);
    const [ remainingCards, setRemainingCards ] = useState(52);
    const [ auto, setAuto ] = useState(false);
    const [ intervalId, setIntervalId ] = useState(0);

    useEffect(() => {
        const newDeck = async () => {
            const res = await axios.get(API_URL);
            setAPI_URL(`https://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`);
            setDeckId(res.data.deck_id);
        }
        newDeck();
    },[]);

    useEffect(() => {
        setRemainingCards(remainingCards-1);
    }, [currentCards]);

    const drawCard = async () => {
        if (remainingCards === -1){
            alert("No Cards Remaining");
        } else {
            const res = await axios.get(API_URL)
            const card = `${res.data.cards[0].value} of ${res.data.cards[0].suit}`;
            setCurrentCards(prevCards => [...prevCards, card]);
        }
    }; 

    const startAuto = () => {
        const intervalId = setInterval(async () => {
            if (remainingCards <= 0) {
                clearInterval(intervalId);
                alert("No Cards Remaining");
            } else {
                const res = await axios.get(API_URL);
                const card = `${res.data.cards[0].value} of ${res.data.cards[0].suit}`;
                setCurrentCards(prevCards => [...prevCards, card]);
                setRemainingCards(prevRemainingCards => prevRemainingCards - 1);
                setAuto(true);
            }
        }, 500);
        setIntervalId(intervalId);
    };

    const stopAuto = () => {
        clearInterval(intervalId);
        setAuto(false);
    };

    return (
        <div className="CardPile">
            <h3>Card Pile</h3>
            <button onClick={drawCard}>Draw Card</button>
            {!auto && (<button onClick={startAuto}>Start AutoDraw</button>)}
            {auto && (<button onClick={stopAuto}>Stop AutoDraw</button>)}
            {!deckId && (<div>Loading Deck...</div>)}
            {currentCards.map((card, index) => (
                <Card key={index} card={card} index={index}/>
            ))}
        </div>
    );
};

export default CardPile;