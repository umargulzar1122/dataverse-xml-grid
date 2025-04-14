import { IInputs } from "../generated/ManifestTypes"
import { JSONObject } from "./JSONObject"
export type ControlProps = {
	context: ComponentFramework.Context<IInputs>,
	selectedRows: (e: Array<JSONObject>) => void
}