/**
 * Finds parameters passed with commands and removes them from the argument list.
 *
 * Params must start with - or /, and after the first param is encountered everything after is assumed to be
 * a param or parameter value.
 *
 * Each array returned from this contains a parameter and optionally any parameter values. For example, if your
 * input is ["cmd1", "cmd2", "-param1", "param1Value", "-param2"], the returned value will be:
 * [ ["-param1", "param1Value"], ["-param2"] ]
 *
 * @param args Commands and params passed to sda
 * @returns A 2D array of parameter arrays, each containing a parameter and optionally parameter values
 */
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
