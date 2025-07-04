import style from "../content.module.scss"

export function SelectControl({
    label,
    options,
    children,
    ...props
}: {
    label: string,
    options: { [key: string | number]: string }
    children?: React.ReactNode
}) {
    return (
        <div>
            <div className={style.row}>
                <div className={style.text}>
                    <label>{label}</label>
                </div>
                <div className={style.control1}>
                    <select {...props}>
                        {Object.keys(options).map(key => <option key={key} value={key}>{options[key]}</option>)}
                    </select>
                </div>
            </div>
            {children}
        </div>
    )
}
