
export const customCommands = {
    jumpCusor: 'jump-cursor' as const
}

export function isHandleCommand(command: string) {
    return Object.values<string>(customCommands).some(customCommand => customCommand === command);
}