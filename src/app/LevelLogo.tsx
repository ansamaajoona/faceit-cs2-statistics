'use client'
import Image from 'next/image';


const LevelLogo = (props: { level: any; className?: any }) => {

    return (
        <Image className={props.className} src={`./level${props.level}.svg`} alt='level image'  width={100} height={100}/>
    )
}

export default LevelLogo;