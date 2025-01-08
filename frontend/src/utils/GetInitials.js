const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => Array.from(n)[0])
      .join("");
};

export default getInitials;