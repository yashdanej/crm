import { Box, Chip, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const Tags = ({ data, onRemove }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Chip label={data} variant="outlined" onDelete={onRemove} />
    </Stack>
  );
};

export default function InputTags({ lead, setLead, tagss }) {
  const [tags, setTags] = useState(tagss ? tagss.split(',') : []);
  const tagRef = useRef();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const newTags = tagRef.current.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !tags.includes(tag));

    if (newTags.length > 0) {
      const updatedTags = [...tags, ...newTags];
      setTags(updatedTags);
      setLead({ ...lead, tags: updatedTags.join(',') });
    }

    tagRef.current.value = "";
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setLead({ ...lead, tags: updatedTags.join(',') });
  };

  useEffect(() => {
    console.log("tags change", lead);
    setTags(tagss ? tagss.split(',') : [])
  }, [tagss]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          inputRef={tagRef}
          fullWidth
          variant='standard'
          size='small'
          sx={{ margin: "1rem 0" }}
          margin='none'
          placeholder={tags?.length < 5 ? "You can also add tags (comma-separated)" : ""}
          InputProps={{
            startAdornment: (
              <Box sx={{ margin: "0 0.2rem 0 0", display: "flex", flexWrap: "wrap" }}>
                {tags?.map((data, index) => (
                  <Tags 
                    data={data} 
                    key={index} 
                    onRemove={() => handleRemoveTag(data)} 
                  />
                ))}
              </Box>
            ),
          }}
        />
      </form>
    </Box>
  );
}
