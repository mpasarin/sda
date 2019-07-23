/** Finds parameters passed with commands and removes them from the argument list */
export default function getParams(args: string[]) {
    const params: string[][] = [];
    let currentParam: string[] = [];
    let firstParamIndex = Number.MAX_VALUE;
    for (let i = 0; i < args.length; i++) {
        if (args[i].charAt(0) === '-' || args[i].charAt(0) === '/') {
            firstParamIndex = Math.min(firstParamIndex, i);
            if (currentParam.length > 0) {
                // End of previous param group
                params.push(currentParam);
                currentParam = [];
            }
            currentParam.push(args[i]);
        } else if (firstParamIndex < i) {
            // If value is passed with param, group them together
            currentParam.push(args[i]);
        }
    }
    if (currentParam.length > 0) {
        params.push(currentParam);
    }
    if (firstParamIndex < args.length) {
        args.splice(firstParamIndex);
    }
    return params;
}
