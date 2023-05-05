import { useEffect, useState } from "react";
import { token, option } from "../resources";

const JitsiMeetJS = window.JitsiMeetJS;

const useConnect = () => {

    const [conn, setConn] = useState();
    useEffect(() => {
        JitsiMeetJS.init();
        const connection = new JitsiMeetJS.JitsiConnection(null, token, option);
        setConn(connection);
    }, []);

    return conn;
};

export default useConnect;
