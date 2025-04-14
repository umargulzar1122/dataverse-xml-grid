import * as React from 'react'
import { ControlProps } from '../types/ControlProps'
import { convertXML } from "simple-xml-to-json";
import { JSONObject } from '../types/JSONObject';
import { getData, getEntityMetaData, getTableHeaders } from '../Helper';
let _primaryKey = "";
const _selectedValue = [] as Array<JSONObject>;
const Control = ({ context, selectedRows }: ControlProps) => {
	const [headers, setHeaders] = React.useState<Array<JSONObject>>([] as JSONObject[]);
	const [entity, setEntity] = React.useState<string>("");
	const [data, setData] = React.useState<Array<JSONObject>>([]);
	const [isLoading, setIsloading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");
	React.useEffect(() => {
		(async () => {
			try {
				setIsloading(true);
				const jsonObject = convertXML(context.parameters.fetchXML.raw!);
				const data = await getTableHeaders(jsonObject) as JSONObject;
				setIsloading(false);
				_primaryKey = data._entityAttributes.find((s: any) => s.isPrimary === true).key;
				if (!context.parameters.recordIds.raw) {
					data._entityAttributes = data._entityAttributes.filter((s: any) => s.isPrimary === false);
				}
				setHeaders([...data._entityAttributes]);
				setEntity(data._entity);
			} catch (error: any) {
				console.error(error);
				setError(error as string)
			}
		})()
	}, [context.parameters.fetchXML.raw!]);
	React.useEffect(() => {
		(async () => {
			try {
				if (headers.length > 0) {
					setIsloading(true);
					const metaData = await getEntityMetaData(entity) as JSONObject;
					const data = await getData(context.parameters.fetchXML.raw!, metaData.LogicalCollectionName) as Array<JSONObject>
					setIsloading(false);
					setData([...data]);
				}
			} catch (error: any) {
				console.error(error);
				setError(error as string);
			}
		})()
	}, [headers]);

	return (
		<>
			<div className='card' style={{
				height: `${context.parameters.tableHeight.raw}px`,
				width: `${context.mode.allocatedWidth}px  !important`
			}}>
				{
					error &&
					<div className="alert">
						<strong>Error!</strong> {error}
					</div>
				}
				{
					(isLoading && !error) &&
					<div style={
						{
							display: "flex",
							justifyContent: 'center',
							alignItems: "center",
							width: "100%",
							height: "100%"
						}}>
						<div className="loader" />
					</div>
				}
				{
					!isLoading
					&&
					<table id="headers">
						<thead>
							<tr style={{
								color: "#fff",
								background: context.parameters.tableHeaderColor.raw!
							}}>
								{
									(context.parameters.selectedMode.raw === "Multi Select" ||
										context.parameters.selectedMode.raw === "Single Select") &&
									<th></th>
								}
								{
									headers &&
									headers.map((item: JSONObject, i: number) => {
										return (
											<>
												<th key={item.key}>
													{
														item.displayName
													}
												</th>
											</>
										)
									})
								}
							</tr>
						</thead>
						<tbody>
							{
								data.map((data) => {
									return (
										<tr>
											{
												context.parameters.selectedMode.raw === "Multi Select" &&
												<td>
													<label className="container ">
														<input type="checkbox" className='curser' defaultChecked={false}
															onChange={(e) => {
																const value = data[_primaryKey];
																if (e.target.checked) {
																	_selectedValue.push({ [_primaryKey]: value })
																} else {
																	const indexOf = _selectedValue.findIndex(s => s[_primaryKey] === value);
																	_selectedValue.splice(indexOf, 1);
																}
																selectedRows(_selectedValue);
															}} />
													</label>
												</td>
											}
											{
												context.parameters.selectedMode.raw === "Single Select" &&
												<td>
													<label className='container'>
														<input type="radio" className='curser' name='selection'
															onChange={(e) => {
																const value = data[_primaryKey];
																_selectedValue.length = 0;
																_selectedValue.push({ [_primaryKey]: value })
																selectedRows(_selectedValue);
															}}
															defaultChecked={false} />
													</label>
												</td>
											}
											{
												headers &&
												headers.map((header) => {
													return (
														<td>
															{
																(() => {
																	if (header.linkEntity) {
																		if (header.type === "String") {
																			return <>
																				{
																					data[`${header.alias}.${header.key}`]
																				}</>
																		}
																		if (header.type === "Lookup") {
																			return <>
																				{
																					data[`${header.alias}.${header.key}`]
																				}</>
																		}
																		if (header.type === "Owner") {
																			return <>
																				{
																					data[`_${header.key}_value@OData.Community.Display.V1.FormattedValue`]
																				}</>
																		}
																	}
																	if (header.type === "Owner" || header.type === "Lookup") {
																		return <>
																			{
																				data[`_${header.key}_value@OData.Community.Display.V1.FormattedValue`]
																			}</>
																	}
																	return <>
																		{
																			data[header.key]
																		}
																	</>
																})()
															}
														</td>
													)
												})
											}
										</tr>
									)
								})
							}
						</tbody>
					</table>
				}
			</div >
		</>
	)
}

export default Control