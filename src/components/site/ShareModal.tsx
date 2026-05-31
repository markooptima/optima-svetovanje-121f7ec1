import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function ShareModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.origin + window.location.pathname);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Povezava kopirana");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Kopiranje ni uspelo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Delite spletno stran</DialogTitle>
          <DialogDescription>Skenirajte kodo za hiter dostop do obrazca.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
            {url && <QRCodeSVG value={url} size={208} level="M" />}
          </div>
          <div className="w-full rounded-lg border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground break-all">
            {url}
          </div>
          <Button onClick={copy} className="w-full" variant="outline">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Kopirano" : "Kopiraj povezavo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
