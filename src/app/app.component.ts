import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements AfterViewInit {

  title = 'rubiks-cube';

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  @Input() public rotationSpeedX: number = 0.01
  @Input() public size = 200

  @Input() cameraZ: number = 400
  @Input() fov: number = 1
  @Input('nearClipping') public nearClippingPlane: number = 1
  @Input('farClipping') public farClippingPlane: number = 1000

  private camera!: THREE.PerspectiveCamera
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
  // private loader = new THREE.TextureLoader
  private blue: THREE.Color = new THREE.Color(0xff8001)
  private geometry = new THREE.BoxGeometry(1, 1, 1)

  private cubes: THREE.Mesh[] = []

  private material = new THREE.MeshLambertMaterial({
    color: this.blue,
    wireframe: true
  })
  private cube: THREE.Mesh = new THREE.Mesh()

  private renderer!: THREE.WebGLRenderer

  private scene!: THREE.Scene

  private directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5)


  private createScene() {
    //* Scene


    this.scene = new THREE.Scene()
    this.directionalLight.position.y = 0
    this.directionalLight.position.z = 1
    this.scene.add(this.directionalLight)
    this.scene.background = new THREE.Color(0xffffff)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          this.cube = new THREE.Mesh(this.geometry, this.material)
          this.cube.position.set(x, y, z)
          this.cubes.push(this.cube)
          this.scene.add(this.cube)
        }
      }
    }

    //* Camera
    let aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private animate() {
    this.cube.rotation.y += this.rotationSpeedX
  }

  private startRenderingLoop() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    let component: AppComponent = this;
    (function render() {
      // requestAnimationFrame(render)
      component.animate()
      component.renderer.render(component.scene, component.camera)
    }())
  }

  private isDragging: boolean = false
  private previousMousePosition: { x: number, y: number } = { x: 0, y: 0 };
  private deltaRotationQuaternion: THREE.Quaternion = new THREE.Quaternion;

  private move(x: number, y: number, event: MouseEvent) {
    // console.log(this.isDragging);
    
    if (this.isDragging) {
      this.deltaRotationQuaternion.setFromEuler(
        new THREE.Euler(
          this.toRadians(x * 1),
          this.toRadians(y * 1),
          0,
          'XYZ'
        )
      )

      this.cubes.forEach( cube => {
        cube.quaternion.multiplyQuaternions( this.deltaRotationQuaternion, cube.quaternion)
      })

      this.previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
      };
    }
  }

  toRadians(angle: number) {
    return angle * (Math.PI / 180);
  }

  ngAfterViewInit(): void {
    this.createScene()
    this.startRenderingLoop()

    this.canvas.addEventListener('mousedown', () => {
      // console.log("click", this.isDragging);
      
      this.isDragging = true
    })

    this.canvas.addEventListener('mousemove', event => {
      const deltaMove = {
        x: event.offsetX - this.previousMousePosition.x,
        y: event.offsetY - this.previousMousePosition.y
      }

      // console.log("Moved. X move: ", deltaMove.x, " Y move: ", deltaMove.y);
      

      this.move(deltaMove.x, deltaMove.y, event)
    })

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false
    })
  }
}
