interface HyperlinkProps {
  id: string,
  type: string,
  mentionText: string
}

const Hyperlink = ({ id, type, mentionText }: HyperlinkProps) => {
  let typeColor = "";
  switch (type) {
    case "char":
      typeColor = "text-blue-500";
      break;
    case "npc":
      typeColor = "text-yellow-500";
      break;
    case "location":
      typeColor = "text-green-500";
      break;
  }

  return (
    <a
      key={`${type}-${id}`}
      href={`/${type}/${id}`}
      //className="text-blue-500 text-sans mention-link hover:underline"
      //className={`bg-${typeColor}-800 rounded px-1 py-0.5`}
      className={`${typeColor} text-sans mention-link hover:underline`}
      onClick={(e) => {
        e.preventDefault();
        // Optional: Add navigation logic here
        window.location.href = `/${type}/${id}`;
      }}
    >
      {mentionText}
    </a>
  )
}

export default Hyperlink
