/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    fetchXML: ComponentFramework.PropertyTypes.StringProperty;
    tableHeaderColor: ComponentFramework.PropertyTypes.StringProperty;
    recordIds: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    tableHeight: ComponentFramework.PropertyTypes.DecimalNumberProperty;
    selectedMode: ComponentFramework.PropertyTypes.EnumProperty<"Single Select" | "Multi Select" | "None">;
}
export interface IOutputs {
    fetchXML?: string;
    selectedRows?: string;
}
