import useConnect from "../useConnect";
import useRoom from "../useRoom";

import Avatar from "../Avatar";

import { throttle } from "../../tool/tools.ts";

import { useEffect, useRef, useState } from "react";
import 'aframe';
import { Entity, Scene } from "aframe-react";

const A = window.AFRAME;
const JitsiMeetJS = window.JitsiMeetJS;
const conf = JitsiMeetJS.events.conference;
const conn = JitsiMeetJS.events.connection;


const WebXR = () => {

    const connection = useConnect();
    const [connected, setConnected] = useState(false);
    const room = useRoom(connection);
    const [users, setUsers] = useState({
        me: [0, 0, 0]
    });

    console.log(users);

    const sendPos = (x, z, r) => {
        room?.sendMessage({
            type: "pos",
            x,
            z,
            r
        });
    };

    const onLocalTracks = tracks => {
        console.log('local tracks');
    };

    const onRemoteTrack = track => {
        console.log('remote tracks');
    };

    const onConferenceJoined = () => {
        console.log('conference joined!');
    };

    const onConnectionFailed = () => {
        console.log('connect failed');
    };

    const disconnect = async () => {
        console.log('disconnect');
    };

    const onUserJoined = id => {
        console.log(`User ${id} Joined!`);
        console.log(users)
        users[id] = [0, 0, 0];
        setUsers({ ...users });
        // const newUsers = {
        //     ...users,
        // }
        // newUsers[id] = [0,0];
        // console.log(newUsers);
        // setUsers(newUsers);
    };

    const onUserLeft = id => {
        console.log(`User ${id} left!`);
        delete users[id];
        setUsers({ ...users });
    };

    const onMessgeReceived = (r, data) => {
        console.log(data);
        switch (data.type) {
            case "pos":
                users[r._id] = [data.x, data.z, data.r]
                setUsers({ ...users });
                break;
            default:
                break;
        }
    };

    const onConnectionSuccess = () => {
        console.log('connect seccuess');
        console.log(room.myUserId());
        setConnected(true);
        room.on(conf.TRACK_ADDED, track => {
            !track.isLocal() && onRemoteTrack(track);
        });
        room.on(conf.CONFERENCE_JOINED, onConferenceJoined);
        room.on(conf.USER_JOINED, onUserJoined);
        room.on(conf.USER_LEFT, onUserLeft);
        room.on(conf.ENDPOINT_MESSAGE_RECEIVED, onMessgeReceived);
        room.join();

        A.registerComponent('send-pos', {
            tick: throttle(function () {
                const pos = this.el.object3D.position;
                const r_y = this.el.getAttribute("rotation").y;
                sendPos(pos.x, pos.z, r_y + 180);
            }, 1200)
        });
    };

    const connect = async () => {
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        const tracks = await JitsiMeetJS.createLocalTracks({
            devices: []
        });
        onLocalTracks(tracks);
        connection.addEventListener(conn.CONNECTION_ESTABLISHED, () => setConnected(true));
        connection.addEventListener(conn.CONNECTION_FAILED, onConnectionFailed);
        connection.addEventListener(conn.CONNECTION_DISCONNECTED, disconnect);
        connection.connect();
    };

    useEffect(() => {
        if (connected) {
            onConnectionSuccess();
        }
    }, [connected]);

    useEffect(() => {
        if (connection) {
            connect();
        }
    }, [connection]);

    const [value, setValue] = useState(0);

    return (
        <div>
            {/* <button onClick={() => {
                setValue(() => value + 1)
                console.log(users);
            }}>+1</button>
            <div>{value}</div>

            {
                Object.keys(users).map(id => id !== "me" && <div> key={id} id={id} pos={users[id]} </div>)
            } */}

            <Scene vr-mode-ui="enterVRButton: #button">
                <a id="button" style={{ position: "fixed", zIndex: 999 }}>Enter VR Mode</a>
                <Entity primitive="a-plane" position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" />
                <Entity primitive="a-sky" color="#ECECEC" />
                <a-entity id='cameraRig'>
                    <Entity id='head' primitive="a-camera" user-height="1.6" look-controls="pointerLockEnabled: true" send-pos>
                        <Entity
                            primitive="a-cursor"
                            cursor={{ fuse: false }}
                            material={{ color: 'white', shader: 'flat', opacity: 0.75 }}
                            geometry={{ radiusInner: 0.005, radiusOuter: 0.007 }}
                        />
                        <Entity primitive="a-box" key="me" id="me" position="-1 0 1" />
                    </Entity>
                    <a-entity id="left-hand" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;" gearvr-controls></a-entity>
                    <a-entity id="right-hand" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;" gearvr-controls></a-entity>
                </a-entity>

                {
                    Object.keys(users).map(id => id !== "me" && <Avatar key={id} id={id} pos={users[id]} />)
                }

                <a-box data-brackets-id="514" color="#AA0000" depth="0.2" height="0.7" width="5" material="" geometry="" position="-1.0 0.35 1.5"></a-box>
                <a-box color="#AA0000" depth="2.4" height="0.1" width="5.5" position="-1.0 0.73905 1.5"></a-box>

                {/* <!--radio--> */}
                <a-entity data-brackets-id="327" id="yellow" gltf-model="aframe/radio/scene.gltf" position="9.11851 0.45804 -7.96256" sound="src: mpi,Benjamin%20-%20Inferno.mp3" scale="0.2 0.2 0.2" rotation="0 17.71 0">
                    <a-sphere data-brackets-id="328" color="#00AA00" radius="0.2" position="-0.5 0.93319 0" play="" material="" geometry=""></a-sphere>
                    <a-sphere data-brackets-id="329" color="#AA0000" radius="0.2" position="0.5 1 0" stop="" material="" geometry=""></a-sphere>
                </a-entity>
                <a-box color="yellow" height="0.422" width="0.39" depth="0.75" position="9.11054 0.25999 -7.98199" data-brackets-id="440" ></a-box>

                {/* <!--celling--> */}
                <a-box color="white" height="1" width="20" depth="20" position="0 4.5 0"></a-box>
                {/* <!--wall--> */}
                <a-box data-brackets-id="600" color="white" position="9.9 2 0" material="" geometry="height: 4; width: 0.2; depth: 20"></a-box>
                <a-box data-brackets-id="627" color="white" position="0 2 -9.9" material="" geometry="height:4; width: 20; depth: 0.2"></a-box>
                <a-box data-brackets-id="845" color="white" position="7.3 2 7.5" material="" geometry="height: 4; width: 5; depth: 0.2"></a-box>
                <a-box data-brackets-id="845" color="white" position="-7.3 2 7.5" material="" geometry="height: 4; width: 5; depth: 0.2"></a-box>
                <a-box data-brackets-id="1083" color="white" position="0.04123 2 7.5" material="" geometry="height: 4; width: 5.82; depth: 0.2"></a-box>
                <a-box data-brackets-id="1637" color="white" position="-3.83305 3.75848 7.5" material="" geometry="height: 0.55; width: 1.96; depth: 0.2"></a-box>
                <a-box data-brackets-id="1637" color="white" position="3.89924 3.75848 7.5" material="" geometry="height: 0.55; width: 1.96; depth: 0.2"></a-box>

                <a-box data-brackets-id="303" color="white" position="-9.9 2 -5.01609" material="" geometry="height: 4; width: 0.2; depth: 9.94"></a-box>

                <a-box data-brackets-id="1062" color="white" position="-9.9 3.36514 0.45838" material="" geometry="width: 0.2; height: 1.29; depth: 1.03"></a-box>
                <a-box data-brackets-id="1138" color="white" position="-9.9 3.37736 5.46013" material="" geometry="width: 0.2; height: 1.28; depth: 1.02"></a-box>
                <a-box data-brackets-id="1062" color="white" position="-9.9 0.50597 0.45838" material="" geometry="width: 0.2; depth: 1.03"></a-box>
                <a-box data-brackets-id="808" color="white" position="-9.9 0.47759 5.4519" material="" geometry="width: 0.2; depth: 1.02"></a-box>

                <a-box data-brackets-id="3234" geometry="depth: 4; height: 4; width: 0.2" color="white" position="-9.9 2 2.95027" ></a-box>
                <a-box data-brackets-id="3234" geometry="depth: 4.06; height: 4; width: 0.2" color="white" position="-9.9 2 7.96626" ></a-box>
                <a-box id="box" height="3" depth="5" width="0.1" color="#green" position="4.13734 1.5 1.5" geometry="" material=""></a-box>

            </Scene>
        </div>
    );

};

export default WebXR;
