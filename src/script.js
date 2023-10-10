import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.2)
directionalLight.position.set(0.65, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 3, 2)
pointLight.position.set(0, 1, 1)
pointLight.castShadow = true
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 3, 5, 1)
rectAreaLight.position.set(0, 1, 1)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.castShadow = true
spotLight.penumbra = 0.5
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -2
scene.add(spotLight)

/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 1
plane.receiveShadow = true

scene.add(sphere, cube, torus, plane)

// Debug Interface

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)
gui.add(ambientLight, 'visible').name("ambientLight")
gui.add(spotLight, 'visible').name("spotlight").onChange( (value) => {
    spotLightHelper.visible = value
})
gui.add(pointLight, 'visible').name("pointLight").onChange( (value) => {
    pointLightHelper.visible = value
})
gui.add(directionalLight, 'visible').name("directionalLight").onChange( (value) => {
    directionalLightHelper.visible = value
})
gui.add(hemisphereLight, 'visible').name("hemisphereLight").onChange( (value) => {
    hemisphereLightHelper.visible = value
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.2 * elapsedTime
    cube.rotation.y = 0.2 * elapsedTime
    torus.rotation.y = 0.2 * elapsedTime

    sphere.rotation.x = 0.25 * elapsedTime
    cube.rotation.x = 0.25 * elapsedTime
    torus.rotation.x = 0.25 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()