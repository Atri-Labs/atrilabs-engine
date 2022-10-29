interface AlertStylesStructure {
    [title: string] : {
        borderColor: string, 
        backgroundColor: string
    }
}

const AlertStyles: AlertStylesStructure = {
    "success": {
        "borderColor": "#b7eb8f",
        "backgroundColor": "#f6ffed",
    },
    "info": {
        "borderColor": "#91d5ff",
        "backgroundColor": "#e6f7ff",
    },
    "warning": {
        "borderColor": "#ffe58f",
        "backgroundColor": "#fffbe6",
    },
    "error": {
        "borderColor": "#ffccc7",
        "backgroundColor": "#fff2f0",
    },
}

export default AlertStyles;
