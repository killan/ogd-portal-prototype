import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from "@angular/core";
import { ListComponent } from "../components/cell-components/list/list.component";
import { CellComponent } from "../interfaces/cell-component";

@Directive({
  selector: '[cellComponentsHost]'
})
export class CellComponentsHostDirective implements OnInit {
  private items!: CellComponent[]
  @Input('cellComponentsHost') set config(items: CellComponent[]) {
    this.items = items
    this.initContent()
  }

  @Input() rowData: any[] = []
  @Input() field = ''

  constructor(
    private vcRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.initContent()
  }

  initContent(): void {
    // Clean
    this.vcRef.clear()

    // Add each item
    this.items.forEach((item) => {
      const factory = this.cfr.resolveComponentFactory<ListComponent>(item.component)

      const component = this.vcRef.createComponent<ListComponent>(factory)
      component.instance.rowData = this.rowData
      component.instance.field = this.field
      component.instance.options = item.options
      component.instance.events = item.events
    })
  }
}
