import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Spinner } from './ui/spinner';

export function Dashboard({ onCreateClick, onLogout, user, isLoggingOut }: { onCreateClick: () => void, onLogout: () => void, user: User, isLoggingOut?: boolean }) {
  const [videos] = useState([
    { id: 1, title: "Birthday Roast for Mike", date: "2 mins ago", status: "Processing", thumbnail: "" },
    { id: 2, title: "Anniversary Surprise", date: "2 days ago", status: "Ready", thumbnail: "https://picsum.photos/seed/dash1/300/169", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  ]);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  
  const googleIdentity = user.identities?.find(id => id.provider === 'google');
  
  const handleLinkGoogle = async () => {
      setIsLinking(true);
      const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: window.location.origin } });
      if (error) {
          alert('Error linking Google: ' + error.message);
          setIsLinking(false);
      }
  };

  const handleUnlinkGoogle = async () => {
      if (!googleIdentity) return;
      if (confirm('Are you sure you want to disconnect Google? You will need your password to login next time.')) {
          setIsLinking(true);
          const { error } = await supabase.auth.unlinkIdentity(googleIdentity);
          setIsLinking(false);
          if (error) alert(error.message);
          else window.location.reload();
      }
  };

  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChangePassword = async () => {
      if (!newPassword) return;
      setIsChangingPassword(true);
      setPasswordMessage(null);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsChangingPassword(false);
      
      if (error) {
          setPasswordMessage({ type: 'error', text: error.message });
      } else {
          setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
          setNewPassword('');
      }
  };

  const handleDeleteAccount = async () => {
      if (confirm('Are you sure? Your account will be deactivated immediately and permanently deleted in 30 days.')) {
           const deletionDate = new Date();
           deletionDate.setDate(deletionDate.getDate() + 30);
           
           const { error } = await supabase.auth.updateUser({
               data: {
                   status: 'deleted',
                   deletion_scheduled_at: deletionDate.toISOString()
               }
           });
           
           if (error) {
               alert('Error scheduling deletion: ' + error.message);
           } else {
               await supabase.auth.signOut();
               alert('Your account has been deactivated. It will be permanently removed in 30 days.');
               window.location.reload();
           }
      }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="border-b h-16 flex items-center justify-between px-6 lg:px-12 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.reload()}>
          VibeVids.ai
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" onClick={() => setShowReferral(true)} className="hidden sm:flex">
             🎁 Invite Friends
           </Button>
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
              {user.email || 'user@example.com'}
           </div>
            <Button variant="ghost" size="sm" onClick={onLogout} disabled={isLoggingOut} className="w-20">
              {isLoggingOut ? <Spinner className="h-4 w-4" /> : 'Logout'}
            </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* WELCOME */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Welcome back! 👋</h1>
            <p className="text-sm text-muted-foreground">Ready to create another viral masterpiece?</p>
          </div>
          <Button size="lg" variant="premium" onClick={onCreateClick} className="w-full md:w-auto text-base shadow-xl shadow-primary/20">
            + Create New Video
          </Button>
        </div>

        {/* REWARDS SECTION */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tighterer">Rewards 🏆</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                       Free HD Video 
                       <span className="text-xl">🎟️</span>
                    </CardTitle>
                    <CardDescription className="text-xs">Refer 5 friends to unlock</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="mt-2 space-y-2">
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-orange-400 w-[60%] transition-all"></div>
                         </div>
                         <div className="flex justify-between text-sm font-medium">
                             <span>3 / 5</span>
                             <span className="text-orange-500">2 more to go!</span>
                         </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                       Free 4K Epic
                       <span className="text-2xl">🎬</span>
                    </CardTitle>
                    <CardDescription>Refer 10 friends to unlock</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="mt-2 space-y-2">
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-purple-500 w-[30%] transition-all"></div>
                         </div>
                         <div className="flex justify-between text-sm font-medium">
                             <span>3 / 10</span>
                             <span className="text-purple-500">7 more to go!</span>
                         </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </section>

        {/* VIDEOS SECTION */}
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tighterer">Your Gallery 🎥</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <div key={video.id} className="group relative aspect-video bg-muted rounded-xl overflow-hidden cursor-pointer hover:ring-1 ring-primary transition-all shadow-md" onClick={() => video.url && setPlayingVideo(video.url)}>
                 {!video.thumbnail ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/30">
                        <Spinner className="w-6 h-6 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rendering</span>
                    </div>
                 ) : (
                    <>
                       <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <div className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/40">
                              <span className="ml-1 text-white text-xl">▶</span>
                          </div>
                       </div>
                    </>
                 )}
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <h3 className="font-black label-caps text-sm truncate">{video.title}</h3>
                      <p className="text-xs text-white/70">{video.date} • {video.status}</p>
                 </div>
              </div>
            ))}
            
            {/* Empty Slots */}
            {[...Array(3)].map((_, i) => (
               <div key={`empty-${i}`} className="aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer group" onClick={onCreateClick}>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <span className="text-xl">+</span>
                  </div>
                  <span className="text-sm font-medium">Create New</span>
               </div>
            ))}
          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section className="space-y-6 max-w-3xl">
           <h2 className="text-2xl font-black tracking-tighterer">Account & Security 🔐</h2>
           <Card>
              <CardContent className="p-0 divide-y">
                 {/* Email Row */}
                 <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">📧</div>
                         <div>
                             <h4 className="font-black label-caps text-sm">Email Address</h4>
                             <p className="text-sm text-muted-foreground">{user.email}</p>
                         </div>
                     </div>
                     <span className="text-xs font-black label-caps bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full w-fit">Primary</span>
                 </div>

                 {/* Google Row */}
                 <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-xl p-2 shadow-sm">
                            <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="G" />
                         </div>
                         <div>
                             <h4 className="font-black label-caps text-sm">Google Account</h4>
                             <p className="text-sm text-muted-foreground">{googleIdentity ? 'Connected' : 'Not connected'}</p>
                         </div>
                     </div>
                     {googleIdentity ? (
                         <Button variant="outline" size="sm" onClick={handleUnlinkGoogle} disabled={isLinking}>
                            {isLinking ? <Spinner className="w-3 h-3" /> : 'Disconnect'}
                         </Button>
                     ) : (
                         <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" onClick={handleLinkGoogle} disabled={isLinking}>
                            {isLinking ? <Spinner className="w-3 h-3" /> : 'Connect Google'}
                         </Button>
                     )}
                 </div>

                 {/* Password Row */}
                 <div className="p-6 space-y-4">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">🔐</div>
                         <div>
                             <h4 className="font-black label-caps text-sm">Change Password</h4>
                             <p className="text-sm text-muted-foreground">Update your login password securely.</p>
                         </div>
                     </div>
                     <div className="flex gap-2 max-w-md ml-auto sm:ml-14">
                         <Input 
                            type="password" 
                            placeholder="New Secure Password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                         />
                         <Button onClick={handleChangePassword} disabled={!newPassword || isChangingPassword}>
                             {isChangingPassword ? <Spinner className="mr-2" /> : 'Update'}
                         </Button>
                     </div>
                     {passwordMessage && (
                         <div className={ `text-xs px-3 py-2 rounded-md ml-auto sm:ml-14 max-w-md ${passwordMessage.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'}` }>
                             {passwordMessage.text}
                         </div>
                     )}
                 </div>

                 {/* Delete Row */}
                 <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-red-50/50">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">⚠️</div>
                         <div>
                             <h4 className="font-black label-caps text-sm text-destructive">Delete Account</h4>
                             <p className="text-sm text-muted-foreground">Permanently delete your data.</p>
                         </div>
                     </div>
                     <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                         Delete Account
                     </Button>
                 </div>
              </CardContent>
           </Card>
        </section>
      </main>

      {/* Video Modal */}
      {playingVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setPlayingVideo(null)}>
                <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass hover:bg-white/20 text-white flex items-center justify-center transition-colors" onClick={() => setPlayingVideo(null)}>×</button>
                    <video src={playingVideo} controls autoPlay className="w-full h-full" />
                </div>
            </div>
      )}

      {/* Referral Modal */}
      {showReferral && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowReferral(false)}>
                <Card className="w-full max-w-md m-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <CardHeader className="relative border-b pb-4">
                        <CardTitle className="text-center text-xl">Invite Friends 🎁</CardTitle>
                        <CardDescription className="text-center">Share your code and get rewards!</CardDescription>
                        <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" onClick={() => setShowReferral(false)}>×</button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                         <div className="text-center space-y-2">
                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Your Code</span>
                            <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-primary/20 cursor-pointer hover:border-primary/50 transition-colors">
                                <span className="text-2xl font-mono font-black tracking-widest text-primary">VIBE-MIKE-2024</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                             <p className="text-sm font-medium text-center">Or share via link:</p>
                             <div className="flex gap-2">
                                 <Input readOnly value="vibevids.ai/ref/user123" className="bg-muted/50" />
                                 <Button variant="outline" onClick={(e) => {
                                     const btn = e.target as HTMLButtonElement;
                                     const originalText = btn.innerText;
                                     btn.innerText = 'Copied!';
                                     setTimeout(() => btn.innerText = originalText, 2000);
                                 }}>Copy</Button>
                             </div>
                         </div>
                    </CardContent>
                </Card>
            </div>
      )}
    </div>
  );
}
