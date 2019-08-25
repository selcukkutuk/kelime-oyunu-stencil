import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "app-harf",
  styleUrl: "app-harf.scss",
  shadow: false
})
export class AppHome {
  @Prop() deger: string = "";
  @Prop() acik: boolean = false;

  render() {
    return (
      <div class="harf shadow mr-3">
        <span>{this.acik ? this.deger : ""}</span>
      </div>
    );
  }
}
