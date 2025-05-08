export function convertResponseToArray(response: string): string[] {
    // Split the string by newline characters and filter out any empty strings
    return response.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}