

export const cleanData = (data: any) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    return cleanData;
}