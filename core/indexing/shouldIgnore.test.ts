// Generated by continue

import { testIde } from "../test/fixtures";
import {
  TEST_DIR,
  addToTestDir,
  setUpTestDir,
  tearDownTestDir,
} from "../test/testDir";

import { shouldIgnore } from "./shouldIgnore";

// Test for the shouldIgnore function
describe("shouldIgnore", () => {
  beforeEach(() => {
    setUpTestDir();
  });

  afterEach(() => {
    tearDownTestDir();
  });

  test("should return true if a file is ignored by .gitignore", async () => {
    addToTestDir([
      ["ignored-file.txt", "content"],
      [".gitignore", "ignored-file.txt"],
    ]);
    const result = await shouldIgnore(TEST_DIR + "/ignored-file.txt", testIde, [
      TEST_DIR,
    ]);
    expect(result).toBe(true);
  });
  test("should return true if a folder is ignored by .continueignore", async () => {
    addToTestDir([
      "ignored-folder/",
      ["ignored-folder/file.txt", "content"],
      [".continueignore", "ignored-folder/"],
    ]);
    const result = await shouldIgnore(
      TEST_DIR + "/ignored-folder/file.txt",
      testIde,
      [TEST_DIR],
    );
    expect(result).toBe(true);
  });
  test("should return false if a file is not ignored", async () => {
    addToTestDir([["kept-file.txt", "contents"]]);
    const result = await shouldIgnore(TEST_DIR + "/kept-file.txt", testIde, [
      TEST_DIR,
    ]);
    expect(result).toBe(false);
  });
  test("should return true if a file is ignored by .gitignore with spaces in file name", async () => {
    addToTestDir([
      ["ignored file.txt", "content"],
      [".gitignore", "ignored file.txt"],
    ]);
    const result = await shouldIgnore(TEST_DIR + "/ignored file.txt", testIde, [
      TEST_DIR,
    ]);
    expect(result).toBe(true);
  });

  test("should return true if a .continueignore override ignores file", async () => {
    addToTestDir([
      ["override-file.txt", "content"],
      [".gitignore", "override-file.txt"],
      [".continueignore", "!override-file.txt"],
    ]);
    const result = await shouldIgnore(
      TEST_DIR + "/override-file.txt",
      testIde,
      [TEST_DIR],
    );
    expect(result).toBe(false);
  });

  test("should return true for deeply nested file ignored by ignore files at multiple levels", async () => {
    addToTestDir([
      "level1/",
      "level1/level2/",
      "level1/level2/level3/",
      ["level1/level2/level3/ignored-file.txt", "content"],
      ["level1/.gitignore", "level2/"],
      ["level1/level2/.continueignore", "level3/"],
    ]);
    const result = await shouldIgnore(
      TEST_DIR + "/level1/level2/level3/ignored-file.txt",
      testIde,
      [TEST_DIR],
    );
    expect(result).toBe(true);
  });

  test("should return false if a file with spaces is not ignored", async () => {
    addToTestDir([["kept file.txt", "contents"]]);
    const result = await shouldIgnore(TEST_DIR + "/kept file.txt", testIde, [
      TEST_DIR,
    ]);
    expect(result).toBe(false);
  });

  test("should handle multiple levels of directories with some files ignored", async () => {
    addToTestDir([
      "nested/",
      "nested/dir1/",
      "nested/dir2/",
      ["nested/dir1/.gitignore", "ignored.txt"],
      ["nested/dir1/ignored.txt", "content"],
      ["nested/dir2/kept.txt", "content"],
    ]);
    const ignoredResult = await shouldIgnore(
      TEST_DIR + "/nested/dir1/ignored.txt",
      testIde,
      [TEST_DIR],
    );
    expect(ignoredResult).toBe(true);

    const keptResult = await shouldIgnore(
      TEST_DIR + "/nested/dir2/kept.txt",
      testIde,
      [TEST_DIR],
    );
    expect(keptResult).toBe(false);
  });
});
