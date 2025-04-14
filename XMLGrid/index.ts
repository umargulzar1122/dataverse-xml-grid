import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Control from "./src/Control";
import { ControlProps } from "./types/ControlProps";
import * as  React from 'react'
import { createRoot, Root } from 'react-dom/client';

export class XMLGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private rootControl: Root;
    private _selectedRows: string = "[]";
    private _notifyOutputChanged: () => void;
    private _tableHeight = 0;
    private _fetchXML = "";
    private _selectionMode = "";
    private _ids: boolean = false;
    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        if (
            context.parameters.tableHeight.raw === this._tableHeight
            &&
            context.parameters.fetchXML.raw === this._fetchXML
            &&
            context.parameters.selectedMode.raw === this._selectionMode
            &&
            context.parameters.recordIds.raw === this._ids
        ) {
            return;
        }
        this._tableHeight = context.parameters.tableHeight.raw || 400;
        this._fetchXML = context.parameters.fetchXML.raw || "";
        this._selectionMode = context.parameters.selectedMode.raw || "none";
        this._ids = context.parameters.recordIds.raw || false;
        this.renderControl();
    }
    private async renderControl() {
        console.log(this._context);
        const props: ControlProps = {
            context: this._context,
            selectedRows: (e) => {
                this._selectedRows = JSON.stringify(e);
                this._notifyOutputChanged();
            }
        };
        this.rootControl = createRoot(this._container);
        this.rootControl.render(
            React.createElement(Control, props),
        );
    }
    public getOutputs(): IOutputs {
        return {
            selectedRows: this._selectedRows
        };
    }

    public destroy(): void {
    }
}
