import {assert, expect} from "chai";
import {IMerkleTreeSerialization, ProgressiveMerkleTree, verifyMerkleBranch} from "../../src/merkleTree";
import {LightProgressiveMerkleTree} from "../../src/merkleTree/lightMerkleTree";
import sinon from "sinon";
import {describe, it} from "mocha";

describe("util/merkleTree", function() {
  describe("ProgressiveMerkleTree", function() {
    it("can push items", () => {
      const t = ProgressiveMerkleTree.empty(4, sinon.stub() as unknown as IMerkleTreeSerialization);
      const buf = Buffer.alloc(32);
      for (let i = 1; i < 10; i++) {
        buf[0] = i;
        t.push(buf);
      }
      expect(true).true;
    });

    it("can add items", () => {
      const t = ProgressiveMerkleTree.empty(4, sinon.stub() as unknown as IMerkleTreeSerialization);
      const buf = Buffer.alloc(32);
      for (let i = 1; i < 10; i++) {
        buf[0] = i;
        t.add(i, buf);
      }
      expect(true).true;
    });

    it("returns valid proofs", () => {
      const depth = 4;
      const t = ProgressiveMerkleTree.empty(
        depth,
        {
          deserializeTree: sinon.stub(),
          serializeTree: sinon.stub(),
          serializeLength: (
            () =>
              Buffer.from("0a00000000000000000000000000000000000000000000000000000000000000", "hex")
          ),
        }
      );
      for (let i = 0; i < 10; i++) {
        const buf = Buffer.alloc(32, i);
        t.push(buf);
      }

      for (let i = 0; i < 10; i++) {
        assert(verifyMerkleBranch(Buffer.alloc(32, i), t.getProof(i), depth, i, t.root()));
      }
    });

  });

  describe("LightProgressiveMerkleTree", function() {
    it("can add items", () => {
      const t = new LightProgressiveMerkleTree(4);
      let count = 0;
      assert.equal(t.count(), count, `Should have ${count} items`);
      const buf = Buffer.alloc(32);
      for (let i = 1; i < 10; i++) {
        buf[0] = i;
        t.push(buf);
        count++;
        assert.equal(t.count(), count, `Should have ${count} items`);
      }
    });
    it("returns valid proofs", () => {
      const depth = 4;
      const t = new LightProgressiveMerkleTree(depth);
      for (let i = 0; i < 10; i++) {
        const buf = Buffer.alloc(32);
        buf[0] = 10;
        const proof = t.push(buf);
        assert(verifyMerkleBranch(buf, proof, depth, t.count() - 1, t.root()));
      }
    });
    it("clones of a tree do not effect the original", () => {
      const depth = 4;
      const t = new LightProgressiveMerkleTree(depth);
      const clone = t.clone();
      for (let i = 0; i < 10; i++) {
        const buf = Buffer.alloc(32);
        buf[0] = 10;
        t.push(buf);
      }
      assert(clone.count() === 0);
      assert(t.count() === 10);
      assert(!clone.root().equals(t.root()));
    });
  });
});
