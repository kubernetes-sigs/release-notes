import { Note, Documentation, DocType } from './notes.model';

describe('Notes Model', () => {
  describe('Note interface', () => {
    it('should create a valid Note object', () => {
      const note: Note = {
        commit: 'abc123',
        text: 'Test note',
        markdown: '# Test',
        author: 'test-author',
        authorUrl: 'https://github.com/test-author',
        prUrl: 'https://github.com/kubernetes/kubernetes/pull/123',
        prNumber: 123,
        areas: ['area1'],
        kinds: ['kind1'],
        sigs: ['sig-test'],
        feature: true,
        duplicate: false,
        action_required: false,
        release_version: '1.20.0',
        documentation: [],
      };

      expect(note).toBeTruthy();
      expect(note.commit).toBe('abc123');
      expect(note.prNumber).toBe(123);
      expect(note.feature).toBe(true);
    });

    it('should allow arrays for areas, kinds, and sigs', () => {
      const note: Note = {
        commit: 'def456',
        text: 'Another test',
        markdown: '## Test',
        author: 'another-author',
        authorUrl: 'https://github.com/another-author',
        prUrl: 'https://github.com/kubernetes/kubernetes/pull/456',
        prNumber: 456,
        areas: ['area1', 'area2', 'area3'],
        kinds: ['bug', 'feature'],
        sigs: ['sig-node', 'sig-testing'],
        feature: false,
        duplicate: true,
        action_required: true,
        release_version: '1.21.0',
        documentation: [],
      };

      expect(note.areas.length).toBe(3);
      expect(note.kinds.length).toBe(2);
      expect(note.sigs.length).toBe(2);
    });
  });

  describe('Documentation interface', () => {
    it('should create a valid Documentation object with description', () => {
      const doc: Documentation = {
        description: 'KEP-123: Test Enhancement',
        url: 'https://github.com/kubernetes/enhancements/blob/master/keps/sig-test/123.md',
        type: DocType.kep,
      };

      expect(doc).toBeTruthy();
      expect(doc.description).toBe('KEP-123: Test Enhancement');
      expect(doc.type).toBe(DocType.kep);
    });

    it('should allow null description', () => {
      const doc: Documentation = {
        description: null,
        url: 'https://kubernetes.io/docs/test',
        type: DocType.official,
      };

      expect(doc).toBeTruthy();
      expect(doc.description).toBeNull();
      expect(doc.type).toBe(DocType.official);
    });
  });

  describe('DocType enum', () => {
    it('should have external type', () => {
      expect(DocType.external).toBe(1);
    });

    it('should have kep type', () => {
      expect(DocType.kep).toBe(2);
    });

    it('should have official type', () => {
      expect(DocType.official).toBe(3);
    });

    it('should allow type comparison', () => {
      const doc1: Documentation = {
        description: 'Test 1',
        url: 'https://test1.com',
        type: DocType.kep,
      };

      const doc2: Documentation = {
        description: 'Test 2',
        url: 'https://test2.com',
        type: DocType.official,
      };

      expect(doc1.type).not.toBe(doc2.type);
      expect(doc1.type).toBe(DocType.kep);
      expect(doc2.type).toBe(DocType.official);
    });
  });

  describe('Note with Documentation', () => {
    it('should allow Note with multiple documentation entries', () => {
      const note: Note = {
        commit: 'ghi789',
        text: 'Note with docs',
        markdown: '### Test',
        author: 'doc-author',
        authorUrl: 'https://github.com/doc-author',
        prUrl: 'https://github.com/kubernetes/kubernetes/pull/789',
        prNumber: 789,
        areas: ['docs'],
        kinds: ['documentation'],
        sigs: ['sig-docs'],
        feature: false,
        duplicate: false,
        action_required: false,
        release_version: '1.22.0',
        documentation: [
          {
            description: 'KEP-456',
            url: 'https://github.com/kubernetes/enhancements/blob/master/keps/sig-test/456.md',
            type: DocType.kep,
          },
          {
            description: null,
            url: 'https://kubernetes.io/docs/reference/test',
            type: DocType.official,
          },
        ],
      };

      expect(note.documentation.length).toBe(2);
      expect(note.documentation[0].type).toBe(DocType.kep);
      expect(note.documentation[1].type).toBe(DocType.official);
      expect(note.documentation[1].description).toBeNull();
    });
  });
});
