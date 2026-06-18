# Multiple Canvas button click not working

## Render Mode

In Unity, there are three Canvas render modes: `Screen Space - Overlay`, `Screen Space - Camera`, and `World Space`. Here's a brief overview of each:

### 1. **Screen Space - Overlay**

- **Description**: This render mode positions the Canvas in screen space, meaning UI elements are rendered directly on the screen.
- **Behavior**: The UI is drawn on top of everything else, and it does not depend on any cameras in the scene.
- **Use Case**: Ideal for creating HUDs (Heads-Up Displays), menus, and other 2D interfaces that should always be visible regardless of the camera's position or orientation.

### 2. **Screen Space - Camera**

- **Description**: This mode also positions the Canvas in screen space, but it requires a reference to a camera.
- **Behavior**: The Canvas is rendered at a position relative to the camera, allowing for perspective effects. UI elements can be occluded by other objects if desired.
- **Use Case**: Suitable for UI elements that should interact with the camera's perspective, such as in-game HUDs that need to fit within the 3D scene's context.

### 3. **World Space**

- **Description**: This render mode positions the Canvas in the world space, meaning UI elements are part of the 3D world.
- **Behavior**: UI elements behave like any other 3D object in the scene. They can be positioned, rotated, and scaled in 3D space and interact with other 3D objects.
- **Use Case**: Perfect for in-world UI elements like health bars above characters, interactive panels, or any UI that needs to be part of the game world.

Each mode serves different purposes and should be chosen based on the specific needs of your game's UI design.

## Issus

I have two Canvas in my scene, the first is `Screen Space - Overlay` and the second is `World Space`.

Every Canvas has one or more buttons. When I click the button in `Screen Space - Overlay`, it works fine. But when I click the button in `World Space`, it doesn't work. Two Canvas's buttons are all set to `RaycastTarget` to `true` already.

When I set the `RaycastTarget` to `false` in the first Canvas, the first Canvas's buttons can't be clicked, but the second Canvas's buttons can be clicked.

I try another way to solve this problem, I set the `RaycastTarget` to `true` in the first Canvas, and add a `BoxCollider` to the button in the second Canvas, Then I can get all buttons clicked event.

- 1. Set button GameObject tag `Button`

- 2. Add `BoxCollider` to the button in the second Canvas

- 3. Handle the button click event

```c#
Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
RaycastHit hit;
if (Physics.Raycast(ray, out hit, 100)) {
  GameObject hitObject = hit.collider.gameObject;
  if (hitObject.tag == "Button") {
    // Do something
  }
}
```

After all, the two Canvas's buttons can be clicked.
