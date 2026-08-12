import { Search, X } from 'lucide-react';
import { Input, Select } from '@/components/ui';
import { Button } from '@/components/ui';

export interface BookFiltersValue {
  search: string;
  category: string;
  author: string;
  availability: '' | 'available' | 'unavailable';
  format: string;
}

export interface BookFiltersProps {
  value: BookFiltersValue;
  onChange: (value: BookFiltersValue) => void;
  categories: string[];
  authors: string[];
  formats: string[];
}

const AVAILABILITY_OPTIONS = [
  { label: 'Available', value: 'available' },
  { label: 'Unavailable', value: 'unavailable' },
];

export function BookFilters({ value, onChange, categories, authors, formats }: BookFiltersProps) {
  const hasActiveFilters = Boolean(value.search || value.category || value.author || value.availability || value.format);

  const clearFilters = () => {
    onChange({ search: '', category: '', author: '', availability: '', format: '' });
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Search by title or author…"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        leftIcon={<Search className="h-4 w-4" />}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select
          placeholder="All Categories"
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
        <Select
          placeholder="All Authors"
          value={value.author}
          onChange={(e) => onChange({ ...value, author: e.target.value })}
          options={authors.map((a) => ({ label: a, value: a }))}
        />
        <Select
          placeholder="All Availability"
          value={value.availability}
          onChange={(e) => onChange({ ...value, availability: e.target.value as BookFiltersValue['availability'] })}
          options={AVAILABILITY_OPTIONS}
        />
        <Select
          placeholder="All Formats"
          value={value.format}
          onChange={(e) => onChange({ ...value, format: e.target.value })}
          options={formats.map((f) => ({ label: f, value: f }))}
        />
      </div>
      {hasActiveFilters && (
        <div>
          <Button variant="ghost" size="sm" leftIcon={<X className="h-3.5 w-3.5" />} onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
