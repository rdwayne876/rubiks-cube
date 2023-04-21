import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'

@Component({
  selector: 'app-rubik-cube',
  templateUrl: './rubik-cube.component.html',
  styleUrls: ['./rubik-cube.component.scss']
})
export class RubikCubeComponent implements OnInit, AfterViewInit {

  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  cubeGeometry!: THREE.BoxGeometry;
  cubeMaterial!: THREE.MeshBasicMaterial;

  cubes!: THREE.Mesh[];

  mouseDown = false;
  lastMouseX = 0;
  lastMouseY = 0;

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.rotateCube(0, 0, 0.1);
        break;
      case 'ArrowDown':
        this.rotateCube(0, 0, -0.1);
        break;
      case 'ArrowLeft':
        this.rotateCube(0, 0.1, 0);
        break;
      case 'ArrowRight':
        this.rotateCube(0, -0.1, 0);
        break;
    }
  }

  constructor() { }

  ngOnInit(): void {
    // Set up the scene and camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Create the cube geometry and material
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.cubes = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial)
          cube.position.set(x, y, z)
          this.scene.add(cube)
          this.cubes.push(cube)
        }
      }
    }

    // Add event listeners for handling mouse clicks and rotations
    document.addEventListener('mousedown', event => {
      this.mouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    });
    document.addEventListener('mouseup', event => {
      this.mouseDown = false;
    });
    document.addEventListener('mousemove', event => {
      if (this.mouseDown) {
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        this.rotateCube(deltaY / 100, deltaX / 100, 0);
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    });
    
  }

  ngAfterViewInit(): void {
    // Render the scene using Three.js
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  rotateCube(x: number, y: number, z: number) {
    const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    this.cubes.forEach(cube => {
      cube.quaternion.multiplyQuaternions(rotationQuaternion, cube.quaternion);
    });
  }


}
