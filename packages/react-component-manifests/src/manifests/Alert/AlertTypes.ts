const AlertTypes: {[title: string]: { title: string, description: string, statusIcon: string, borderColor: string, backgroundColor: string }} = {
    "success": {
        "title": "Success Title",
        "description": "Success Description",
        "statusIcon": "",
        "borderColor": "#b7eb8f",
        "backgroundColor": "#f6ffed",
    },
    "info": {
        "title": "Info Title",
        "description": "Info Description",
        "statusIcon": "",
        "borderColor": "#91d5ff",
        "backgroundColor": "#e6f7ff",
    },
    "warning": {
        "title": "Warning Title",
        "description": "Warning Description",
        "statusIcon": "",
        "borderColor": "#ffe58f",
        "backgroundColor": "#fffbe6",
    },
    "error": {
        "title": "Error Title",
        "description": "Error Description",
        "statusIcon": "",
        "borderColor": "#ffccc7",
        "backgroundColor": "#fff2f0",
    },
}

export default AlertTypes;
