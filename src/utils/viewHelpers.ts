const categoryForWorldName = (worldName: string) => {
  switch(worldName?.toLowerCase()) {
    case "the hub":
      return "Community Spaces";
    case "strange clan":
      return "Games";
    case "blok hous":
      return "Venues";
    default:
      return "Spaces";
  }
}

export {
  categoryForWorldName
}
