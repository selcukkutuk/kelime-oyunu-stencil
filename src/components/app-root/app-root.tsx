import { Component, h } from "@stencil/core";

@Component({
  tag: "app-root",
  styleUrl: "app-root.scss",
  shadow: false
})
export class AppRoot {
  render() {
    return (
      <div class="container mt-4">
        <stencil-router>
          <stencil-route-switch scrollTopOffset={0}>
            <stencil-route url="/" component="app-home" exact={true} />
          </stencil-route-switch>
        </stencil-router>{" "}
      </div>
    );
  }
}
