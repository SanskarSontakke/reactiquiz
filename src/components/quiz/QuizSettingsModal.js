// src/components/quiz/QuizSettingsModal.js
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl,
  InputLabel, Select, MenuItem, TextField, useTheme, CircularProgress
} from '@mui/material';
import { darken } from '@mui/material/styles';

// --- START OF FIX: Accept isSubmitting as a prop ---
function QuizSettingsModal({ 
    open, 
    onClose, 
    onSubmit, 
    topicName, 
    accentColor,
    isSubmitting // <-- New prop
}) {
// --- END OF FIX ---
  const theme = useTheme();
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [numQuestionsError, setNumQuestionsError] = useState('');
  
  const effectiveAccentColor = accentColor || theme.palette.primary.main;

  useEffect(() => {
    if (open) {
      setDifficulty('medium');
      setNumQuestions(10);
      setNumQuestionsError('');
    }
  }, [open]);

  const handleNumQuestionsChange = (event) => {
    // ... this function is unchanged
    const value = event.target.value;
    const maxQs = 50;
    if (value === '' || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= maxQs)) {
      setNumQuestions(value === '' ? '' : Number(value));
      setNumQuestionsError('');
    } else {
      setNumQuestions(value);
      if (value !== '' && (Number(value) < 1 || Number(value) > maxQs || !/^\d+$/.test(value))) {
        setNumQuestionsError(`Please enter a number between 1 and ${maxQs}.`);
      } else {
        setNumQuestionsError('');
      }
    }
  };

  const handleSubmit = () => {
    // ... this function is now synchronous and simpler
    const maxQs = 50;
    const finalNumQuestions = numQuestions === '' ? 10 : Number(numQuestions);
    if (finalNumQuestions < 1 || finalNumQuestions > maxQs || isNaN(finalNumQuestions)) {
      setNumQuestionsError(`Please enter a valid number between 1 and ${maxQs}.`);
      return;
    }
    onSubmit({ difficulty, numQuestions: finalNumQuestions });
  };
  
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: '300px', maxWidth: '500px' } }}>
      <DialogTitle sx={{ backgroundColor: effectiveAccentColor, color: theme.palette.getContrastText(effectiveAccentColor), pb: 1.5, pt: 2 }}>
        Quiz Settings: {topicName}
      </DialogTitle>
      <DialogContent sx={{ pt: '20px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* ... Dialog content is unchanged ... */}
        <FormControl fullWidth>
          <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-select-label"
            id="difficulty-select"
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
            <MenuItem value="mixed">Mixed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label={`Number of Questions (1-50)`}
          type="number"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          inputProps={{ min: 1, max: 50, step: 1 }}
          error={!!numQuestionsError}
          helperText={numQuestionsError}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} sx={{ color: effectiveAccentColor }}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          // --- START OF FIX: Use the isSubmitting prop ---
          disabled={isSubmitting || !!numQuestionsError || numQuestions === ''}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          // --- END OF FIX ---
          sx={{
            backgroundColor: effectiveAccentColor,
            color: theme.palette.getContrastText(effectiveAccentColor),
            '&:hover': { backgroundColor: darken(effectiveAccentColor, 0.2) }
          }}
        >
          {isSubmitting ? 'Starting...' : 'Start Quiz'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuizSettingsModal;