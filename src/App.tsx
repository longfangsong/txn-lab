import React, {FC} from 'react';
import './App.css';
import Timeline from "./component/Timeline/Timeline";
import {StartTxnRequest} from "./model/event/startTxn";
import {Prewrite} from "./model/event/prewrite/prewrite";
import {Put} from "./model/mutation";
import {Commit} from "./model/event/commit/commit";
import {Session} from "./model/session";

const App: FC = () => {
    let session = new Session();
    session.events.push(new StartTxnRequest(10));
    session.events.push(new Prewrite(10, [
        new Put("a", "val1"),
        new Put("b", "val2"),
    ], "a", 15));
    session.events.push(new Prewrite(21, [
        new Put("c", "val3"),
        new Put("d", "val4"),
    ], "c", 20));
    session.events.push(new Commit(10, ["a", "b"], "a", 50));
    // store.push(new GetRequest(21, 60, "a"));

    return <div className="App">
        <Timeline session={session} style={{margin: "10px", padding: "10px"}}/>
    </div>
};

export default App;