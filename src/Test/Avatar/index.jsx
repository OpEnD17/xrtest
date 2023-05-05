import 'aframe';
import { Entity, Scene } from "aframe-react";
import { useEffect, useRef } from 'react';

const Avatar = ({ id, pos }) => {

    const avatarRef = useRef(null);

    useEffect(() => {
        console.log(pos);
        if (avatarRef.current){
            avatarRef.current.el.setAttribute("id", id);
            avatarRef.current.el.object3D.position.set(pos[0], 0, pos[1]);
            avatarRef.current.el.setAttribute('rotation', {x: 0, y: pos[2], z: 0});
            console.log(avatarRef.current.el)
        }
    }, [pos[0], pos[1]]);

    return (
        <Entity primitive="a-box" gltf-model = "avatar/scene.gltf" scale = "0.1 0.1 0.1" ref={avatarRef} />
    )
}

export default Avatar;
