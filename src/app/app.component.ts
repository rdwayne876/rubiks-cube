import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements  AfterViewInit{
 
  title = 'rubiks-cube';

  @ViewChild('canvas')
  private canvasRef!: ElementRef; 

  @Input() public rotationSpeedX: number = 0.05
  @Input() public size = 200

  @Input() cameraZ: number = 400
  @Input() fov: number = 1
  @Input( 'nearClipping') public nearClippingPlane: number = 1
  @Input( 'farClipping') public farClippingPlane: number = 1000

  private camera!: THREE.PerspectiveCamera
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
  // private loader = new THREE.TextureLoader
  private geometry = new THREE.BoxGeometry( 1, 1, 1)
  private material = new THREE.MeshLambertMaterial({
    color: 0x79BEF4
  })
  private cube: THREE.Mesh = new THREE.Mesh( this.geometry, this.material)

  private renderer!: THREE.WebGLRenderer

  private scene!: THREE.Scene

  
  private createScene(){
    //* Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    this.scene.add( this.cube)

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

  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private animate() {
    this.cube.rotation.y += this.rotationSpeedX
  }

  private startRenderingLoop() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas})
    this.renderer.setPixelRatio( devicePixelRatio)
    this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight)

    let component: AppComponent = this;
    ( function render() {
      requestAnimationFrame( render)
      component.animate()
      component.renderer.render( component.scene, component.camera)
    }())
  }

  ngAfterViewInit(): void {
    this.createScene()
    this.startRenderingLoop()
  }
}
