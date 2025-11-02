import React, { useState } from 'react';
import { Button, Flex, Grid, TextField, SelectField } from '@aws-amplify/ui-react';

export default function QuestionCreateForm({ onSubmit, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({
    questionText: '',
    description: '',
    category: 'family'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="medium" padding="medium">
        <TextField
          label="Question"
          placeholder="Enter your question..."
          value={formData.questionText}
          onChange={(e) => handleChange('questionText', e.target.value)}
          required
        />
        
        <TextField
          label="Description (Optional)"
          placeholder="Add more context to your question..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        
        <SelectField
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </SelectField>
        
        <Flex direction="row" gap="medium" justifyContent="flex-end">
          <Button type="button" onClick={onCancel} variation="link">
            Cancel
          </Button>
          <Button type="submit" variation="primary">
            Create Question
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}