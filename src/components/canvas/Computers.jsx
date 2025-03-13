import { Suspense, useEffect, useState } from 'react';
import { Canvas, events } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei'; // These are React components, so use PascalCase
import CanvasLoader from '../Loader';
import { useGLTF } from '@react-three/drei';

const Computers = ({isMobile}) => {
  const computer = useGLTF('./desktop_pc/ImageToStl.com_cctv.gltf'); // Use destructuring for `scene`
  return (
    <mesh>
  <hemisphereLight intensity={2.5} groundColor="green" />
  <pointLight intensity={1} position={[5, 5, 5]} />
  <spotLight 
    position={[-20, 50, 10]} 
    angle={0.12} 
    penumbra={1} 
    intensity={1.5} 
    castShadow 
    shadow-mapSize={1024} 
  />
  <primitive 
    object={computer.scene}
    scale={isMobile ?  10:10}
    position={isMobile ? [0,-3,-2.2]:[0, -3.25, -1.5]}
    rotation={[-0.01, -0.2, -0.1]}
  />
  <meshStandardMaterial 
    color="black" 
    roughness={10} 
    metalness={10} 
  />
</mesh>

  )
}

const ComputersCanvas = () => {
  const [isMobile,setIsMobile]=useState(false);
  useEffect(() => {
    const mediaQuery=window.matchMedia('(max-width:500px)');

    setIsMobile(mediaQuery.matches);      
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }
    mediaQuery.addEventListener('change',
      handleMediaQueryChange);
      return ()=> {
        mediaQuery.removeEventListener('change',
          handleMediaQueryChange );
      }



  }, [ ])
  


  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile } />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas;
