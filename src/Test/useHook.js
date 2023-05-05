import axios from "axios";
import { useEffect, useState } from "react";

const useHook = () => {

    console.log("hook");
    const [data, setData] = useState(null);
    useEffect(() => {
        console.log("hook effect");
        async function fetch() {
            const result = await axios.get('http://localhost:8080/query');
            setData(result);
        }
        fetch();
    }, []);

    return data;

};

export default useHook;